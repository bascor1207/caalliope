import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { createFileStore } from "./file-store";
import { createSqlStore } from "./sql-store";
import { type AnalyticsStore, createMemoryStore } from "./store";

export { createFileStore } from "./file-store";

/** Store Postgres via le driver HTTP Neon (zéro connexion persistante : idéal en serverless). */
export function createNeonStore(databaseUrl: string): AnalyticsStore {
  const sql = neon(databaseUrl);
  return createSqlStore((text, params) => sql.query(text, params) as Promise<Record<string, unknown>[]>);
}

/**
 * Store Postgres générique (Supabase, ou tout Postgres) via le driver `postgres`.
 * Pensé pour le pooler de transactions de Supabase (port 6543) : pas de requêtes préparées, peu de connexions.
 */
export function createPostgresStore(databaseUrl: string): AnalyticsStore {
  const sql = postgres(databaseUrl, { prepare: false, max: 3, idle_timeout: 20, connect_timeout: 10 });
  return createSqlStore(
    (text, params) => sql.unsafe(text, params as never[]) as unknown as Promise<Record<string, unknown>[]>,
  );
}

/** Neon reconnu à son hôte, tout le reste passe par le driver générique. */
export const createDatabaseStore = (databaseUrl: string): AnalyticsStore =>
  /\.neon\.tech(:|\/|$)/.test(databaseUrl) ? createNeonStore(databaseUrl) : createPostgresStore(databaseUrl);

/** Racine du monorepo (dossier contenant pnpm-workspace.yaml), ou le dossier courant à défaut. */
export function workspaceRoot(from = process.cwd()): string {
  let dir = resolve(from);
  for (;;) {
    if (existsSync(join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return resolve(from);
    dir = parent;
  }
}

export interface StoreEnv {
  DATABASE_URL?: string;
  /** Nom injecté par l'intégration Supabase du Marketplace Vercel (URL poolée). */
  POSTGRES_URL?: string;
  ANALYTICS_FILE?: string;
  NODE_ENV?: string;
}

/**
 * Choix du stockage par l'environnement :
 *  - DATABASE_URL ou POSTGRES_URL → Postgres (Supabase, Neon…), production.
 *  - ANALYTICS_FILE            → fichier JSONL explicite (tests de bout en bout).
 *  - sinon, hors production    → fichier JSONL partagé à la racine du monorepo (.data/analytics.jsonl).
 *  - sinon                     → mémoire, avec avertissement : les stats ne survivront pas au déploiement.
 */
export function createAnalyticsStoreFromEnv(env: StoreEnv = process.env): AnalyticsStore {
  const databaseUrl = env.DATABASE_URL ?? env.POSTGRES_URL;
  if (databaseUrl) return createDatabaseStore(databaseUrl);
  if (env.ANALYTICS_FILE) return createFileStore(env.ANALYTICS_FILE);
  if (env.NODE_ENV !== "production") return createFileStore(join(workspaceRoot(), ".data", "analytics.jsonl"));
  console.warn("[analytics] DATABASE_URL absent : événements gardés en mémoire uniquement.");
  return createMemoryStore();
}
