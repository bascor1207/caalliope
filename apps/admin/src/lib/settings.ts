import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getSql, hasDatabase } from "@koda/db";

/**
 * Réglages éditables depuis le back-office, stockés dans `site_settings` (clé → JSON).
 * Les secrets (mot de passe SMTP) sont chiffrés AES-256-GCM avec une clé dérivée d'ADMIN_SECRET :
 * la base ne les contient jamais en clair.
 */
export async function getSetting<T>(key: string): Promise<T | null> {
  if (!hasDatabase()) return null;
  const [row] = await getSql()<{ value: T }[]>`SELECT value FROM site_settings WHERE key = ${key}`;
  return row?.value ?? null;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await getSql()`INSERT INTO site_settings (key, value, updated_at) VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
}

const keyOf = () =>
  createHash("sha256")
    .update(process.env.ADMIN_SECRET ?? "koda-dev-secret")
    .digest();

export function seal(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyOf(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `enc:${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${data.toString("hex")}`;
}

export function unseal(sealed: string | undefined | null): string {
  if (!sealed) return "";
  if (!sealed.startsWith("enc:")) return sealed;
  const [, iv, tag, data] = sealed.split(":");
  try {
    const decipher = createDecipheriv("aes-256-gcm", keyOf(), Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(tag, "hex"));
    return Buffer.concat([decipher.update(Buffer.from(data, "hex")), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}

/* ---------- E-mail (SMTP de la boîte KODA) ---------- */
export interface SmtpSettings {
  host: string;
  port: number;
  user: string;
  /** Chiffré en base ; vide = inchangé lors d'une sauvegarde. */
  pass: string;
  from: string;
}

export const SMTP_KEY = "email.smtp";

export async function getSmtpSettings(): Promise<SmtpSettings | null> {
  const s = await getSetting<SmtpSettings>(SMTP_KEY);
  return s?.host ? { ...s, pass: unseal(s.pass) } : null;
}

/* ---------- Réseaux sociaux et contact (pied de page de la boutique) ---------- */
export interface SocialSettings {
  instagram: string;
  tiktok: string;
  facebook: string;
  youtube: string;
  email: string;
}

export const SOCIAL_KEY = "social";

export const DEFAULT_SOCIAL: SocialSettings = {
  instagram: "https://www.instagram.com/koda__clothing/",
  tiktok: "https://www.tiktok.com/@kodaclothing",
  facebook: "https://www.facebook.com/kodaclothing/",
  youtube: "",
  email: "hello@kodaclothing.fr",
};

export async function getSocialSettings(): Promise<SocialSettings> {
  return { ...DEFAULT_SOCIAL, ...((await getSetting<Partial<SocialSettings>>(SOCIAL_KEY)) ?? {}) };
}

/** Demande à la boutique de rafraîchir son cache (pied de page, contenus) après un changement de réglage. */
export async function revalidateShop(tag: string): Promise<boolean> {
  const base = process.env.SHOP_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) return false;
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/revalidate?tag=${encodeURIComponent(tag)}`, {
      method: "POST",
      headers: { authorization: `Bearer ${secret}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
