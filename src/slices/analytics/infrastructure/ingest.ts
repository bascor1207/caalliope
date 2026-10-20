import type { AnalyticsEvent, AnalyticsEventName } from "../domain/analytics";
import { analyticsSink } from "./container";

const NAMES: AnalyticsEventName[] = [
  "page_view",
  "product_view",
  "product_chosen",
  "cart_opened",
  "search",
  "checkout_started",
  "checkout_failed",
  "order_placed",
  "newsletter_subscribed",
];

const MAX_BATCH = 50;

/** Valide et nettoie un lot d'événements reçu du navigateur avant de l'écrire dans le puits. */
export async function ingest(payload: unknown): Promise<number> {
  if (!Array.isArray(payload)) return 0;
  const events: AnalyticsEvent[] = [];
  for (const raw of payload.slice(0, MAX_BATCH)) {
    if (!raw || typeof raw !== "object") continue;
    const e = raw as Record<string, unknown>;
    if (!NAMES.includes(e.name as AnalyticsEventName)) continue;
    const props: AnalyticsEvent["props"] = {};
    if (e.props && typeof e.props === "object") {
      for (const [k, v] of Object.entries(e.props as Record<string, unknown>).slice(0, 10)) {
        if (typeof v === "string") props[k] = v.slice(0, 120);
        else if (typeof v === "number" || typeof v === "boolean") props[k] = v;
      }
    }
    events.push({
      name: e.name as AnalyticsEventName,
      at: new Date().toISOString(),
      session: String(e.session ?? "").slice(0, 40),
      path: String(e.path ?? "/").slice(0, 200),
      locale: String(e.locale ?? "fr").slice(0, 5),
      props,
    });
  }
  if (events.length) await analyticsSink.append(events);
  return events.length;
}
