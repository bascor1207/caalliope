import { type AnalyticsStore, createSqlStore } from "@koda/analytics";
import { createAnalyticsStoreFromEnv } from "@koda/analytics/node";
import { getSql, whenDatabase } from "@koda/db";

/**
 * Stockage des événements : Postgres (Supabase) via le client partagé `@koda/db` (Hyperdrive sur Cloudflare,
 * DATABASE_URL ailleurs) ; sans base, fichier partagé en développement ou mémoire. Choix fait à l'usage.
 */
export const analyticsStore: AnalyticsStore = whenDatabase(
  () =>
    createSqlStore(
      (text, params) => getSql().unsafe(text, params as never[]) as unknown as Promise<Record<string, unknown>[]>,
    ),
  () => createAnalyticsStoreFromEnv({ ...process.env, DATABASE_URL: undefined, POSTGRES_URL: undefined }),
);
