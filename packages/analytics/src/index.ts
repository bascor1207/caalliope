/** Point d'entrée universel (client et serveur) : contrats, synthèse, nettoyage, ports. Aucune dépendance Node. */
export { type AnalyticsEvent, type AnalyticsEventName, EVENT_NAMES, type EventProps, isEventName } from "./events";
export { type SanitizeOptions, sanitizeEvents } from "./sanitize";
export { createSqlStore, SCHEMA_STATEMENTS, type SqlExecutor } from "./sql-store";
export { type AnalyticsStore, createMemoryStore } from "./store";
export { type AnalyticsSummary, type DailyPoint, type DateRange, summarize, top } from "./summary";
