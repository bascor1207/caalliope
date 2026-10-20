import type { AnalyticsEvent } from "../domain/analytics";

/** Port serveur : où atterrissent les événements (mémoire pour le POC, KV / Postgres / Tinybird ensuite). */
export interface AnalyticsSink {
  append(events: AnalyticsEvent[]): Promise<void>;
  readAll(): Promise<AnalyticsEvent[]>;
}

/** Port client : comment le navigateur envoie ses événements. */
export interface AnalyticsTransport {
  send(events: AnalyticsEvent[]): void;
}
