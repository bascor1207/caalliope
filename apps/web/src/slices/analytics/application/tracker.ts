import type { AnalyticsEvent, AnalyticsEventName } from "@koda/analytics";
import type { EventBus, Unsubscribe } from "@/shared/event-bus";
import type { AnalyticsTransport } from "./ports";

export interface TrackerContext {
  session: string;
  locale: string;
  path: () => string;
  now: () => string;
}

/** File d'événements avec envoi groupé : limite les requêtes, survit à la fermeture d'onglet via flush(). */
export function createTracker(transport: AnalyticsTransport, ctx: TrackerContext, flushEvery = 2000) {
  let queue: AnalyticsEvent[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    if (queue.length === 0) return;
    const batch = queue;
    queue = [];
    transport.send(batch);
  };

  const track = (name: AnalyticsEventName, props: AnalyticsEvent["props"] = {}) => {
    queue.push({ name, props, at: ctx.now(), session: ctx.session, path: ctx.path(), locale: ctx.locale });
    if (!timer) timer = setTimeout(flush, flushEvery);
  };

  return { track, flush };
}

export type Tracker = ReturnType<typeof createTracker>;

/** Bus → analytics : chaque fait publié par une slice devient un événement de mesure. */
export function bindAnalyticsToBus(bus: EventBus, tracker: Tracker): Unsubscribe {
  const subs = [
    bus.subscribe("catalog.product-viewed", (p) =>
      tracker.track("product_view", { productId: p.productId, colorKey: p.colorKey }),
    ),
    bus.subscribe("catalog.product-chosen", (p) =>
      tracker.track("product_chosen", {
        productId: p.productId,
        colorKey: p.colorKey,
        size: p.size,
        unitPrice: p.unitPrice,
      }),
    ),
    bus.subscribe("catalog.search-performed", (p) => tracker.track("search", { query: p.query, results: p.results })),
    bus.subscribe("cart.open-requested", () => tracker.track("cart_opened")),
    bus.subscribe("checkout.started", (p) => tracker.track("checkout_started", { count: p.count, total: p.total })),
    bus.subscribe("checkout.failed", (p) => tracker.track("checkout_failed", { code: p.code })),
    bus.subscribe("checkout.order-placed", (p) => tracker.track("order_placed", { total: p.total })),
    bus.subscribe("newsletter.subscribed", () => tracker.track("newsletter_subscribed")),
  ];
  return () => {
    for (const u of subs) u();
  };
}
