/**
 * Serveur d'autorisation OAuth 2.1 minimal pour le MCP de l'admin (claude.ai, ChatGPT, Cursor… exigent OAuth avec
 * enregistrement dynamique et PKCE). Tout est sans état : clients, codes et jetons sont des charges utiles signées
 * HMAC-SHA256 avec ADMIN_SECRET, donc aucune table et ça marche en serverless.
 */
const enc = new TextEncoder();
const dec = new TextDecoder();

export const ACCESS_TTL = 3600;
export const REFRESH_TTL = 30 * 86_400;
export const CODE_TTL = 300;
export const SCOPE = "admin";

export const b64url = (bytes: Uint8Array | ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromB64url = (s: string) => {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(`oauth:${secret}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}

const safeEqual = (a: string, b: string) => {
  const x = enc.encode(a);
  const y = enc.encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
};

type Kind = "client" | "code" | "access" | "refresh";

interface Payload {
  k: Kind;
  iat: number;
  exp?: number;
  [key: string]: unknown;
}

export async function sign(secret: string, payload: Payload): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  return `${body}.${await hmac(secret, body)}`;
}

export async function verify<T extends Payload>(
  secret: string,
  token: string | undefined,
  kind: Kind,
  now = Date.now(),
): Promise<T | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if (!safeEqual(sig, await hmac(secret, body))) return null;
  try {
    const payload = JSON.parse(dec.decode(fromB64url(body))) as T;
    if (payload.k !== kind) return null;
    if (payload.exp && payload.exp * 1000 < now) return null;
    return payload;
  } catch {
    return null;
  }
}

const seconds = (now: number) => Math.floor(now / 1000);

/** Une URI de redirection acceptable : HTTPS, ou localhost en clair pour les outils de développement. */
export const isAllowedRedirect = (uri: string) => {
  try {
    const u = new URL(uri);
    if (u.protocol === "https:") return true;
    return u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1");
  } catch {
    return false;
  }
};

export interface ClientPayload extends Payload {
  k: "client";
  name: string;
  redirects: string[];
}

/** Enregistrement dynamique (RFC 7591) : l'identifiant client porte ses URIs de redirection, signées. */
export async function registerClient(
  secret: string,
  input: { client_name?: string; redirect_uris: string[] },
  now = Date.now(),
): Promise<{ client_id: string; client_name: string; redirect_uris: string[] }> {
  const redirects = input.redirect_uris.filter(isAllowedRedirect).slice(0, 10);
  if (redirects.length === 0) throw new Error("invalid_redirect_uri");
  const name = (input.client_name ?? "Client MCP").slice(0, 80);
  const client_id = await sign(secret, { k: "client", iat: seconds(now), name, redirects });
  return { client_id, client_name: name, redirect_uris: redirects };
}

export const readClient = (secret: string, clientId: string | undefined) =>
  verify<ClientPayload>(secret, clientId, "client");

export interface CodePayload extends Payload {
  k: "code";
  client: string;
  redirect: string;
  challenge: string;
  scope: string;
}

export async function issueCode(
  secret: string,
  input: { client_id: string; redirect_uri: string; code_challenge: string; scope?: string },
  now = Date.now(),
): Promise<string> {
  return sign(secret, {
    k: "code",
    iat: seconds(now),
    exp: seconds(now) + CODE_TTL,
    client: input.client_id,
    redirect: input.redirect_uri,
    challenge: input.code_challenge,
    scope: input.scope || SCOPE,
  });
}

export async function pkceMatches(verifier: string, challenge: string): Promise<boolean> {
  if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(verifier)) return false;
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(verifier));
  return safeEqual(b64url(digest), challenge);
}

export interface TokenPayload extends Payload {
  k: "access" | "refresh";
  client: string;
  scope: string;
}

export async function issueTokens(secret: string, client: string, scope: string, now = Date.now()) {
  const iat = seconds(now);
  return {
    access_token: await sign(secret, { k: "access", iat, exp: iat + ACCESS_TTL, client, scope }),
    token_type: "Bearer" as const,
    expires_in: ACCESS_TTL,
    refresh_token: await sign(secret, { k: "refresh", iat, exp: iat + REFRESH_TTL, client, scope }),
    scope,
  };
}

export const readAccessToken = (secret: string, token: string | undefined) =>
  verify<TokenPayload>(secret, token, "access");
export const readRefreshToken = (secret: string, token: string | undefined) =>
  verify<TokenPayload>(secret, token, "refresh");

/** Métadonnées du serveur d'autorisation (RFC 8414), issuer = origine publique de l'admin. */
export const authorizationServerMetadata = (issuer: string) => ({
  issuer,
  authorization_endpoint: `${issuer}/oauth/authorize`,
  token_endpoint: `${issuer}/oauth/token`,
  registration_endpoint: `${issuer}/oauth/register`,
  response_types_supported: ["code"],
  response_modes_supported: ["query"],
  grant_types_supported: ["authorization_code", "refresh_token"],
  code_challenge_methods_supported: ["S256"],
  token_endpoint_auth_methods_supported: ["none", "client_secret_post"],
  scopes_supported: [SCOPE],
});

/** Métadonnées de la ressource protégée (RFC 9728) : le MCP pointe vers son serveur d'autorisation. */
export const protectedResourceMetadata = (issuer: string) => ({
  resource: `${issuer}/api/mcp`,
  authorization_servers: [issuer],
  bearer_methods_supported: ["header"],
  scopes_supported: [SCOPE],
  resource_name: "KODA admin (MCP)",
});

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, mcp-protocol-version",
  "Cache-Control": "no-store",
};
