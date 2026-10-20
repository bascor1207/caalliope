import nodemailer from "nodemailer";
import { getSmtpSettings, type SmtpSettings } from "./settings";

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendOutcome {
  to: string;
  ok: boolean;
  error?: string;
}

export type Transport = { kind: "smtp"; smtp: SmtpSettings } | { kind: "resend"; from: string } | { kind: "none" };

const ENV_FROM = () => process.env.EMAIL_FROM ?? "KODA Clothing <hello@kodaclothing.fr>";

/** Réglage SMTP posé dans l'environnement (repli quand rien n'est saisi dans le back-office). */
const envSmtp = (): SmtpSettings | null =>
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 465),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: ENV_FROM(),
      }
    : null;

/**
 * Transport choisi, dans l'ordre :
 * - SMTP saisi dans le back-office (Réglages → E-mails), puis SMTP de l'environnement : les mails partent
 *   de la boîte KODA elle-même (Gmail / Google Workspace, OVH, Ionos…), sans service tiers ;
 * - Resend si `RESEND_API_KEY` est posée (3 000 mails / mois gratuits) ;
 * - sinon simulation : rien ne part, chaque message est marqué envoyé (dev).
 */
export async function resolveTransport(): Promise<Transport> {
  const smtp = (await getSmtpSettings()) ?? envSmtp();
  if (smtp?.host && smtp.user && smtp.pass) return { kind: "smtp", smtp };
  if (process.env.RESEND_API_KEY) return { kind: "resend", from: ENV_FROM() };
  return { kind: "none" };
}

/** Libellé lisible du transport pour l'admin. */
export const transportLabel = (t: Transport): string => {
  if (t.kind === "smtp") return `${t.smtp.from} via ${t.smtp.host}`;
  if (t.kind === "resend") return `${t.from} via Resend`;
  return "Aucun envoi configuré : les envois sont simulés";
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function sendSmtp(messages: OutgoingEmail[], smtp: SmtpSettings): Promise<SendOutcome[]> {
  const port = Number(smtp.port || 465);
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port,
    secure: port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
  });
  /* Les boîtes grand public limitent le débit (Gmail : ~500 destinataires / jour, 2 000 en Workspace) : on espace. */
  const pause = Number(process.env.SMTP_PAUSE_MS ?? 250);
  const outcomes: SendOutcome[] = [];
  try {
    for (const m of messages) {
      try {
        const unsubscribe = listUnsubscribe(m.html);
        await transporter.sendMail({
          from: smtp.from || smtp.user,
          to: m.to,
          subject: m.subject,
          html: m.html,
          text: m.text,
          headers: unsubscribe ? { "List-Unsubscribe": unsubscribe } : undefined,
        });
        outcomes.push({ to: m.to, ok: true });
      } catch (e) {
        outcomes.push({ to: m.to, ok: false, error: e instanceof Error ? e.message : String(e) });
      }
      if (pause > 0) await sleep(pause);
    }
  } finally {
    transporter.close();
  }
  return outcomes;
}

/** Reprend le lien de désinscription présent dans le HTML pour l'en-tête standard (Gmail l'affiche). */
const listUnsubscribe = (html: string): string | undefined => {
  const m = html.match(/href="([^"]*desinscription[^"]*)"/);
  return m ? `<${m[1].replace(/&amp;/g, "&")}>` : undefined;
};

async function sendResend(messages: OutgoingEmail[], from: string): Promise<SendOutcome[]> {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const outcomes: SendOutcome[] = [];
  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100);
    const { error } = await resend.batch.send(
      chunk.map((m) => ({ from, to: [m.to], subject: m.subject, html: m.html, text: m.text })),
    );
    for (const m of chunk) outcomes.push({ to: m.to, ok: !error, error: error?.message });
    if (error) break;
  }
  return outcomes;
}

export async function sendEmails(messages: OutgoingEmail[]): Promise<SendOutcome[]> {
  if (messages.length === 0) return [];
  const t = await resolveTransport();
  if (t.kind === "smtp") return sendSmtp(messages, t.smtp);
  if (t.kind === "resend") return sendResend(messages, t.from);
  console.warn(`[mailer] aucun transport : ${messages.length} e-mail(s) simulé(s).`);
  return messages.map((m) => ({ to: m.to, ok: true }));
}

/** Teste les identifiants SMTP (connexion + authentification) sans rien envoyer. */
export async function verifySmtp(smtp: SmtpSettings): Promise<{ ok: boolean; error?: string }> {
  const port = Number(smtp.port || 465);
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port,
    secure: port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });
  try {
    await transporter.verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  } finally {
    transporter.close();
  }
}
