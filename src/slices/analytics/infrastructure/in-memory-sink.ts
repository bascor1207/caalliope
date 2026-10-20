import type { AnalyticsSink } from "../application/ports";
import type { AnalyticsEvent } from "../domain/analytics";

const MAX = 50_000;

/** Puits en mémoire (POC). Sur Vercel chaque instance a sa mémoire : brancher KV / Postgres pour le dashboard. */
export class InMemoryAnalyticsSink implements AnalyticsSink {
  private events: AnalyticsEvent[] = [];

  async append(events: AnalyticsEvent[]): Promise<void> {
    this.events.push(...events);
    if (this.events.length > MAX) this.events = this.events.slice(-MAX);
  }

  async readAll(): Promise<AnalyticsEvent[]> {
    return this.events;
  }
}
