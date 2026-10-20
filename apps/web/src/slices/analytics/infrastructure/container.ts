import { createAnalyticsStoreFromEnv } from "@koda/analytics/node";

/** Stockage des événements : Neon (DATABASE_URL) en production, fichier partagé en développement. */
export const analyticsStore = createAnalyticsStoreFromEnv(process.env);
