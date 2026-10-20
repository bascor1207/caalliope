import type { AnalyticsEvent } from "@koda/analytics";

/** Port client : comment le navigateur envoie ses événements. */
export interface AnalyticsTransport {
  send(events: AnalyticsEvent[]): void;
}
