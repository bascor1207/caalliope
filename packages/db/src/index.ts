import postgres, { type Sql } from "postgres";

export type { Sql };

let client: Sql | null = null;

/** Postgres est-il configuré (DATABASE_URL ou POSTGRES_URL) ? */
export const hasDatabase = (env: NodeJS.ProcessEnv = process.env): boolean =>
  Boolean(env.DATABASE_URL ?? env.POSTGRES_URL);

/**
 * Client Postgres partagé (driver `postgres`), pensé pour le pooler de transactions Supabase :
 * pas de requêtes préparées, peu de connexions, créé à la première requête.
 */
export function getSql(env: NodeJS.ProcessEnv = process.env): Sql {
  if (client) return client;
  const url = env.DATABASE_URL ?? env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL manquante : la base Postgres n'est pas configurée.");
  client = postgres(url, { prepare: false, max: 3, idle_timeout: 20, connect_timeout: 10 });
  return client;
}
