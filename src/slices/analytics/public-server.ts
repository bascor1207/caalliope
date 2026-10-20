/** Interface publique serveur de la slice analytics : ingestion et synthèse (futur dashboard). */
export { type AnalyticsEvent, type AnalyticsSummary, summarize } from "./domain/analytics";
export { analyticsSink } from "./infrastructure/container";
export { ingest } from "./infrastructure/ingest";
