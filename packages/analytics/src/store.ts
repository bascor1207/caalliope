import type { AnalyticsEvent } from "./events";
import type { DateRange } from "./summary";

/** Port de persistance : où atterrissent les événements et comment on les relit par période. */
export interface AnalyticsStore {
  append(events: AnalyticsEvent[]): Promise<void>;
  read(range: DateRange): Promise<AnalyticsEvent[]>;
}

const inRange = (e: AnalyticsEvent, range: DateRange) => {
  const t = Date.parse(e.at);
  return t >= range.from.getTime() && t <= range.to.getTime();
};

/** Mémoire vive : tests et repli. Perdu à chaque redémarrage, jamais partagé entre instances. */
export function createMemoryStore(max = 50_000): AnalyticsStore {
  let events: AnalyticsEvent[] = [];
  return {
    async append(batch) {
      events.push(...batch);
      if (events.length > max) events = events.slice(-max);
    },
    async read(range) {
      return events.filter((e) => inRange(e, range));
    },
  };
}

export { inRange };
