/** Point d'entrée universel (client et serveur) : contrats, synthèse, nettoyage, ports. Aucune dépendance Node. */
export {
  type AnalyticsEvent,
  type AnalyticsEventName,
  EVENT_NAMES,
  type EventItem,
  type EventProps,
  isEventName,
  type Primitive,
} from "./events";
export { type SanitizeOptions, sanitizeEvents } from "./sanitize";
export { createSqlStore, SCHEMA_STATEMENTS, type SqlExecutor } from "./sql-store";
export { type AnalyticsStore, createMemoryStore } from "./store";
export {
  type AnalyticsSummary,
  type ColorStats,
  type DailyPoint,
  type DateRange,
  type SourceStats,
  summarize,
  top,
} from "./summary";
