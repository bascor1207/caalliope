import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { createFileStore } from "./file-store";
import { createSqlStore } from "./sql-store";
import { type AnalyticsStore, createMemoryStore } from "./store";

export { createFileStore } from "./file-store";

/** Store Postgres via le driver HTTP Neon (palier gratuit, zéro connexion persistante : idéal en serverless). */
export function createNeonStore(databaseUrl: string): AnalyticsStore {
  const sql = neon(databaseUrl);
  return createSqlStore((text, params) => sql.query(text, params) as Promise<Record<string, unknown>[]>);
}

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
  ANALYTICS_FILE?: string;
  NODE_ENV?: string;
}

/**
 * Choix du stockage par l'environnement :
 *  - DATABASE_URL (Neon)       → Postgres, production.
 *  - ANALYTICS_FILE            → fichier JSONL explicite (tests de bout en bout).
 *  - sinon, hors production    → fichier JSONL partagé à la racine du monorepo (.data/analytics.jsonl).
 *  - sinon                     → mémoire, avec avertissement : les stats ne survivront pas au déploiement.
 */
export function createAnalyticsStoreFromEnv(env: StoreEnv = process.env): AnalyticsStore {
  if (env.DATABASE_URL) return createNeonStore(env.DATABASE_URL);
  if (env.ANALYTICS_FILE) return createFileStore(env.ANALYTICS_FILE);
  if (env.NODE_ENV !== "production") return createFileStore(join(workspaceRoot(), ".data", "analytics.jsonl"));
  console.warn("[analytics] DATABASE_URL absent : événements gardés en mémoire uniquement.");
  return createMemoryStore();
}
