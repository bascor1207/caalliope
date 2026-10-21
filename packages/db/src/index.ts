import postgres, { type Sql } from "postgres";

export type { Sql };

const clients = new Map<string, Sql>();
let resolver: (() => string | undefined) | null = null;

/** Postgres est-il configuré (DATABASE_URL ou POSTGRES_URL, ou une source déclarée par `setDatabaseUrlResolver`) ? */
export const hasDatabase = (env: NodeJS.ProcessEnv = process.env): boolean =>
  Boolean(resolveUrl() ?? env.DATABASE_URL ?? env.POSTGRES_URL);

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
interface CloudflareContext {
  env?: { HYPERDRIVE?: { connectionString?: string } };
  ctx?: { waitUntil?: (p: Promise<unknown>) => void };
}

/** Contexte de la requête en cours sur Workers (objet propre à chaque requête), `undefined` ailleurs. */
const cloudflareContext = (): CloudflareContext | undefined => {
  try {
    return (globalThis as Record<symbol, unknown>)[Symbol.for("__cloudflare-context__")] as
      | CloudflareContext
      | undefined;
  } catch {
    return undefined;
  }
};

const hyperdriveUrl = (): string | undefined => cloudflareContext()?.env?.HYPERDRIVE?.connectionString || undefined;

const resolveUrl = (): string | undefined => {
  try {
    return resolver?.() ?? hyperdriveUrl();
  } catch {
    return hyperdriveUrl();
  }
};

const OPTIONS = { prepare: false, connect_timeout: 10, fetch_types: false } as const;
/** Sur Workers : un client par requête, car un socket ouvert pour une requête est inutilisable (blocage) par une autre. */
const perRequest = new WeakMap<object, Sql>();

/**
 * Client Postgres (driver `postgres`), pensé pour les poolers (Supabase, Hyperdrive) : pas de requêtes préparées,
 * peu de connexions. Partagé par processus sur Node (Vercel, scripts) ; propre à la requête sur Cloudflare Workers,
 * où Hyperdrive tient le vrai pool et où le runtime interdit de réutiliser les E/S d'une requête terminée.
 */
export function getSql(env: NodeJS.ProcessEnv = process.env): Sql {
  const url = resolveUrl() ?? env.DATABASE_URL ?? env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL manquante : la base Postgres n'est pas configurée.");
  const cf = cloudflareContext();
  if (cf) {
    let client = perRequest.get(cf);
    if (!client) {
      client = postgres(url, { ...OPTIONS, max: 2, idle_timeout: 5 });
      perRequest.set(cf, client);
    }
    return client;
  }
  let client = clients.get(url);
  if (!client) {
    client = postgres(url, { ...OPTIONS, max: 3, idle_timeout: 20 });
    clients.set(url, client);
  }
  return client;
}

/**
 * Aiguillage paresseux entre deux implémentations selon la présence de la base, évalué à chaque accès et non au
 * chargement du module : sur Cloudflare Workers, les bindings (Hyperdrive, variables) n'existent qu'au sein d'une
 * requête, un choix figé à l'évaluation du module tomberait toujours sur la version mémoire.
 * Chaque implémentation est instanciée au plus une fois, à sa première utilisation.
 */
export function whenDatabase<T extends object>(withDatabase: () => T, withoutDatabase: () => T): T {
  let db: T | undefined;
  let memory: T | undefined;
  const current = (): T => {
    if (hasDatabase()) {
      db ??= withDatabase();
      return db;
    }
    memory ??= withoutDatabase();
    return memory;
  };
  return new Proxy({} as T, {
    get(_, prop) {
      const target = current();
      const value = Reflect.get(target, prop, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
    has: (_, prop) => prop in current(),
    ownKeys: () => Reflect.ownKeys(current()),
    getOwnPropertyDescriptor(_, prop) {
      const descriptor = Reflect.getOwnPropertyDescriptor(current(), prop);
      return descriptor ? { ...descriptor, configurable: true } : undefined;
    },
  });
}
