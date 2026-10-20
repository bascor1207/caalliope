/** Interface publique serveur de la slice analytics : ingestion et accès au store (synthèse pour l'admin). */
export { type AnalyticsSummary, summarize } from "./domain/analytics";
export { analyticsStore } from "./infrastructure/container";
export { ingest } from "./infrastructure/ingest";
