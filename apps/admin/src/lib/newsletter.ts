import { getSql, hasDatabase } from "@koda/db";
import { bodyToText, type CampaignContent, renderCampaignHtml } from "./email-template";
import { sendEmails } from "./mailer";

export interface Subscriber {
  id: string;
  email: string;
  locale: string;
  status: "subscribed" | "unsubscribed";
  source: string;
  token: string;
  subscribed_at: string;
}

export interface Campaign extends CampaignContent {
  id: string;
  status: "draft" | "sending" | "sent";
  recipients: number;
  sent: number;
  failed: number;
  createdAt: string;
  sentAt: string | null;
}

interface CampaignRow {
  id: string;
  subject: string;
  preheader: string;
  title: string;
  body: string;
  cta_label: string;
  cta_url: string;
  image_url: string;
  status: Campaign["status"];
  recipients: number;
  sent: number;
  failed: number;
  created_at: Date | string;
  sent_at: Date | string | null;
}

const toCampaign = (r: CampaignRow): Campaign => ({
  id: r.id,
  subject: r.subject,
  preheader: r.preheader,
  title: r.title,
  body: r.body,
  ctaLabel: r.cta_label,
  ctaUrl: r.cta_url,
  imageUrl: r.image_url,
  status: r.status,
  recipients: r.recipients,
  sent: r.sent,
  failed: r.failed,
  createdAt: new Date(r.created_at).toISOString(),
  sentAt: r.sent_at ? new Date(r.sent_at).toISOString() : null,
});

export const shopUrl = () => process.env.SHOP_URL ?? "https://kodaclothing.vercel.app";
export const renderOptionsFor = (token: string, outlook = false) => ({
  shopUrl: shopUrl(),
  unsubscribeUrl: `${shopUrl()}/newsletter/desinscription?token=${encodeURIComponent(token)}`,
  logoUrl: `${shopUrl()}/media/koda-logo.png`,
  outlook,
});

export async function listSubscribers(): Promise<Subscriber[]> {
  if (!hasDatabase()) return [];
  const rows = await getSql()<
    Subscriber[]
  >`SELECT id, email, locale, status, source, token, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC LIMIT 5000`;
  return rows.map((r) => ({ ...r, subscribed_at: new Date(r.subscribed_at).toISOString() }));
}

export async function deleteSubscriber(id: string): Promise<void> {
  await getSql()`DELETE FROM newsletter_subscribers WHERE id = ${id}`;
}

export async function subscriberStats(): Promise<{ total: number; active: number; last30: number }> {
  if (!hasDatabase()) return { total: 0, active: 0, last30: 0 };
  const [r] = await getSql()<{ total: number; active: number; last30: number }[]>`
    SELECT count(*)::int AS total,
           count(*) FILTER (WHERE status = 'subscribed')::int AS active,
           count(*) FILTER (WHERE status = 'subscribed' AND subscribed_at > now() - interval '30 days')::int AS last30
    FROM newsletter_subscribers`;
  return r ?? { total: 0, active: 0, last30: 0 };
}

export async function listCampaigns(): Promise<Campaign[]> {
  if (!hasDatabase()) return [];
  const rows = await getSql()<CampaignRow[]>`SELECT * FROM campaigns ORDER BY created_at DESC LIMIT 200`;
  return rows.map(toCampaign);
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  if (!hasDatabase()) return null;
  const [row] = await getSql()<CampaignRow[]>`SELECT * FROM campaigns WHERE id = ${id}`;
  return row ? toCampaign(row) : null;
}

export async function createCampaign(): Promise<string> {
  const [row] = await getSql()<
    { id: string }[]
  >`INSERT INTO campaigns (subject, title) VALUES ('Nouvelle campagne', 'Titre de la campagne') RETURNING id`;
  return row.id;
}

export async function updateCampaign(id: string, c: CampaignContent): Promise<void> {
  await getSql()`
    UPDATE campaigns SET subject = ${c.subject}, preheader = ${c.preheader}, title = ${c.title}, body = ${c.body},
      cta_label = ${c.ctaLabel}, cta_url = ${c.ctaUrl}, image_url = ${c.imageUrl}, updated_at = now()
    WHERE id = ${id} AND status = 'draft'`;
}

export async function deleteCampaign(id: string): Promise<void> {
  await getSql()`DELETE FROM campaigns WHERE id = ${id} AND status = 'draft'`;
}

/** E-mail de test vers une adresse (lien de désinscription factice). */
export async function sendTest(c: CampaignContent, to: string): Promise<{ ok: boolean; error?: string }> {
  const o = renderOptionsFor("test");
  const [outcome] = await sendEmails([
    { to, subject: `[Test] ${c.subject}`, html: renderCampaignHtml(c, o), text: bodyToText(c, o) },
  ]);
  return outcome ? { ok: outcome.ok, error: outcome.error } : { ok: false, error: "rien à envoyer" };
}

/** Envoi à tous les inscrits actifs qui ne l'ont pas encore reçue (reprise possible après une limite d'envoi). */
export async function sendCampaign(id: string): Promise<{ sent: number; failed: number; remaining: number }> {
  const sql = getSql();
  const campaign = await getCampaign(id);
  if (!campaign || campaign.status === "sent") return { sent: 0, failed: 0, remaining: 0 };
  const pending = await sql<Subscriber[]>`
    SELECT s.id, s.email, s.locale, s.status, s.source, s.token, s.subscribed_at FROM newsletter_subscribers s
    WHERE s.status = 'subscribed' AND NOT EXISTS (SELECT 1 FROM campaign_deliveries d WHERE d.campaign_id = ${id} AND d.email = s.email)
    ORDER BY s.subscribed_at`;
  await sql`UPDATE campaigns SET status = 'sending', recipients = (SELECT count(*) FROM newsletter_subscribers WHERE status = 'subscribed') WHERE id = ${id}`;
  const messages = pending.map((s) => {
    const o = renderOptionsFor(s.token);
    return {
      to: s.email,
      subject: campaign.subject,
      html: renderCampaignHtml(campaign, o),
      text: bodyToText(campaign, o),
    };
  });
  const outcomes = await sendEmails(messages);
  let sent = 0;
  let failed = 0;
  for (const [i, outcome] of outcomes.entries()) {
    const s = pending[i];
    await sql`INSERT INTO campaign_deliveries (campaign_id, subscriber_id, email, status, error)
              VALUES (${id}, ${s.id}, ${s.email}, ${outcome.ok ? "sent" : "failed"}, ${outcome.error ?? null})
              ON CONFLICT (campaign_id, email) DO NOTHING`;
    if (outcome.ok) sent += 1;
    else failed += 1;
  }
  const remaining = pending.length - outcomes.length;
  await sql`UPDATE campaigns SET sent = sent + ${sent}, failed = failed + ${failed},
            status = ${remaining > 0 ? "sending" : "sent"}, sent_at = CASE WHEN ${remaining} = 0 THEN now() ELSE sent_at END
            WHERE id = ${id}`;
  return { sent, failed, remaining };
}
