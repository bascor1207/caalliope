import postgres, { type Sql } from "postgres";

export type { Sql };

const clients = new Map<string, Sql>();
let resolver: (() => string | undefined) | null = null;

/** Postgres est-il configuré (DATABASE_URL ou POSTGRES_URL, ou une source déclarée par `setDatabaseUrlResolver`) ? */
export const hasDatabase = (env: NodeJS.ProcessEnv = process.env): boolean =>
  Boolean(resolveUrl(env) ?? env.DATABASE_URL ?? env.POSTGRES_URL);

/**
 * Source d'URL prioritaire, déclarée par l'application : sur Cloudflare Workers la boutique lit la chaîne de
 * connexion du binding Hyperdrive (pool et TLS gérés par Cloudflare, car `tls.connect` de workerd ne sait pas
 * monter le STARTTLS de Postgres). Ailleurs (Vercel, build, tests), DATABASE_URL suffit.
 */
export function setDatabaseUrlResolver(fn: (() => string | undefined) | null): void {
  resolver = fn;
}

/**
 * Sur Cloudflare Workers (OpenNext), le contexte de la requête (bindings compris) est exposé sur un symbole global :
 * on y lit la chaîne de connexion Hyperdrive sans dépendre du paquet OpenNext (ce module sert aussi à l'admin sur Vercel).
 */
const hyperdriveUrl = (): string | undefined => {
  try {
    const ctx = (globalThis as Record<symbol, unknown>)[Symbol.for("__cloudflare-context__")] as
      | { env?: { HYPERDRIVE?: { connectionString?: string } } }
      | undefined;
    return ctx?.env?.HYPERDRIVE?.connectionString || undefined;
  } catch {
    return undefined;
  }
};

const resolveUrl = (env: NodeJS.ProcessEnv): string | undefined => {
  try {
    return resolver?.() ?? hyperdriveUrl();
  } catch {
    return hyperdriveUrl();
  }
};

/**
 * Client Postgres partagé (driver `postgres`), pensé pour les poolers (Supabase, Hyperdrive) :
 * pas de requêtes préparées, peu de connexions, un client par chaîne de connexion, créé à la première requête.
 */
export function getSql(env: NodeJS.ProcessEnv = process.env): Sql {
  const url = resolveUrl(env) ?? env.DATABASE_URL ?? env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL manquante : la base Postgres n'est pas configurée.");
  let client = clients.get(url);
  if (!client) {
    client = postgres(url, { prepare: false, max: 3, idle_timeout: 20, connect_timeout: 10, fetch_types: false });
    clients.set(url, client);
  }
  return client;
}
