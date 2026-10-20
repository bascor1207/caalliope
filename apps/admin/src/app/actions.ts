"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, credentials, issueToken, SESSION_SECONDS, safeEqual } from "@/lib/auth";
import { verifySmtp } from "@/lib/mailer";
import {
  getSmtpSettings,
  revalidateShop,
  SMTP_KEY,
  type SmtpSettings,
  SOCIAL_KEY,
  type SocialSettings,
  seal,
  setSetting,
} from "@/lib/settings";
import { supabaseConfigured, supabaseServer } from "@/lib/supabase";
import { type Role, roleOf, setFlag, setRole } from "@/lib/users";

export interface LoginState {
  error: "config" | "password" | "credentials" | "not-admin" | null;
}

async function openSession() {
  const creds = credentials(process.env);
  if (!creds) return false;
  const jar = await cookies();
  jar.set(COOKIE, await issueToken(creds.secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return true;
}

/** Connexion par compte Supabase : l'e-mail doit avoir le rôle admin dans `profiles`. */
export async function loginWithAccount(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!supabaseConfigured()) return { error: "config" };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "credentials" };
  const role = await roleOf(data.user.id);
  if (role !== "admin") {
    await supabase.auth.signOut();
    return { error: "not-admin" };
  }
  if (!(await openSession())) return { error: "config" };
  redirect("/");
}

/** Accès de secours : mot de passe maître (ADMIN_PASSWORD), tant que l'équipe n'a pas de compte admin. */
export async function loginWithMasterPassword(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const creds = credentials(process.env);
  if (!creds) return { error: "config" };
  if (!safeEqual(String(formData.get("password") ?? ""), creds.password)) return { error: "password" };
  await openSession();
  redirect("/");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(COOKIE);
  if (supabaseConfigured()) {
    const supabase = await supabaseServer();
    await supabase.auth.signOut().catch(() => undefined);
  }
  redirect("/login");
}

export async function toggleFlag(formData: FormData) {
  const key = String(formData.get("key") ?? "");
  const enabled = formData.get("enabled") === "true";
  if (key) await setFlag(key, enabled);
  revalidatePath("/parametres");
}

export async function changeRole(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const role = formData.get("role") === "admin" ? "admin" : ("customer" as Role);
  if (id) await setRole(id, role);
  revalidatePath("/utilisateurs");
}

export interface SettingsState {
  ok?: string;
  error?: string;
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/** Enregistre la boîte d'envoi (SMTP). Mot de passe vide = on garde l'ancien. Vérifie la connexion avant d'écrire. */
export async function saveSmtp(_prev: SettingsState, f: FormData): Promise<SettingsState> {
  const current = await getSmtpSettings();
  const next: SmtpSettings = {
    host: str(f, "host"),
    port: Number(str(f, "port") || 465),
    user: str(f, "user"),
    pass: str(f, "pass") || current?.pass || "",
    from: str(f, "from") || str(f, "user"),
  };
  if (!next.host || !next.user || !next.pass) return { error: "Serveur, identifiant et mot de passe sont requis." };
  const check = await verifySmtp(next);
  if (!check.ok) return { error: `Connexion refusée par ${next.host} : ${check.error}` };
  await setSetting(SMTP_KEY, { ...next, pass: seal(next.pass) });
  revalidatePath("/parametres");
  return { ok: `Boîte d'envoi enregistrée : ${next.from} via ${next.host}.` };
}

export async function clearSmtp(): Promise<void> {
  await setSetting(SMTP_KEY, {});
  revalidatePath("/parametres");
}

/** Envoie un e-mail de test avec la configuration enregistrée. */
export async function sendSmtpTest(_prev: SettingsState, f: FormData): Promise<SettingsState> {
  const to = str(f, "to");
  if (!to.includes("@")) return { error: "Adresse de test invalide." };
  const { sendEmails, resolveTransport, transportLabel } = await import("@/lib/mailer");
  const t = await resolveTransport();
  if (t.kind === "none") return { error: "Aucune boîte d'envoi configurée." };
  const [r] = await sendEmails([
    {
      to,
      subject: "Test d'envoi KODA",
      html: "<p>Ceci est un test envoyé depuis le back-office KODA. Si tu le lis, la configuration fonctionne.</p>",
      text: "Ceci est un test envoyé depuis le back-office KODA. Si tu le lis, la configuration fonctionne.",
    },
  ]);
  return r?.ok ? { ok: `E-mail de test envoyé à ${to} (${transportLabel(t)}).` } : { error: r?.error ?? "Échec." };
}

const url = (f: FormData, k: string) => {
  const v = str(f, k);
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

/** Réseaux sociaux et e-mail de contact affichés par la boutique. */
export async function saveSocial(_prev: SettingsState, f: FormData): Promise<SettingsState> {
  const next: SocialSettings = {
    instagram: url(f, "instagram"),
    tiktok: url(f, "tiktok"),
    facebook: url(f, "facebook"),
    youtube: url(f, "youtube"),
    email: str(f, "email"),
  };
  await setSetting(SOCIAL_KEY, next);
  const refreshed = await revalidateShop("settings");
  revalidatePath("/parametres");
  return {
    ok: refreshed
      ? "Réseaux enregistrés, la boutique est à jour."
      : "Réseaux enregistrés. La boutique les reprendra d'ici une heure (SHOP_URL / REVALIDATE_SECRET absents pour un rafraîchissement immédiat).",
  };
}
