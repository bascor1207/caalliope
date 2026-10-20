/**
 * Session admin : cookie signé HMAC-SHA256 (Web Crypto, fonctionne dans le proxy comme dans les actions serveur).
 * Aucune dépendance, aucune base : le mot de passe et le secret viennent de l'environnement.
 */
export const COOKIE = "koda_admin";
const DAY = 86_400;
export const SESSION_SECONDS = 7 * DAY;

const enc = new TextEncoder();

const hex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}

/** Comparaison à temps constant (évite de deviner le mot de passe octet par octet). */
export function safeEqual(a: string, b: string): boolean {
  const x = enc.encode(a);
  const y = enc.encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export interface AuthEnv {
  ADMIN_PASSWORD?: string;
  ADMIN_SECRET?: string;
  NODE_ENV?: string;
}

/** En développement sans configuration, un mot de passe par défaut évite de bloquer ; jamais en production. */
export function credentials(env: AuthEnv): { password: string; secret: string } | null {
  if (env.ADMIN_PASSWORD && env.ADMIN_SECRET) return { password: env.ADMIN_PASSWORD, secret: env.ADMIN_SECRET };
  if (env.NODE_ENV !== "production") return { password: "koda", secret: "dev-secret-koda-admin" };
  return null;
}

/** Jeton de session : `expiration.signature`. */
export async function issueToken(secret: string, now = Date.now()): Promise<string> {
  const exp = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${exp}.${await hmac(secret, exp)}`;
}

export async function verifyToken(secret: string, token: string | undefined, now = Date.now()): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) * 1000 < now) return false;
  return safeEqual(sig, await hmac(secret, exp));
}
