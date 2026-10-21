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
  let lastSearch = { query: "", at: 0 };
  const subs = [
    bus.subscribe("catalog.product-viewed", (p) =>
      tracker.track("product_view", { productId: p.productId, colorKey: p.colorKey }),
    ),
    bus.subscribe("catalog.product-chosen", (p) =>
      tracker.track("add_to_cart", {
        productId: p.productId,
        colorKey: p.colorKey,
        size: p.size,
        price: p.unitPrice,
        qty: p.qty,
        from: p.source ?? "pdp",
      }),
    ),
    bus.subscribe("catalog.size-selected", (p) =>
      tracker.track("size_selected", { productId: p.productId, colorKey: p.colorKey, size: p.size }),
    ),
    bus.subscribe("catalog.soldout-clicked", (p) =>
      tracker.track("soldout_click", { productId: p.productId, colorKey: p.colorKey, size: p.size }),
    ),
    bus.subscribe("cart.line-removed", (p) =>
      tracker.track("remove_from_cart", { productId: p.productId, colorKey: p.colorKey, size: p.size, qty: p.qty }),
    ),
    bus.subscribe("catalog.search-performed", (p) => {
      /* La même requête arrive deux fois (saisie dans l'en-tête puis page de résultats) : une seule mesure. */
      const key = p.query.toLowerCase();
      if (lastSearch.query === key && Date.now() - lastSearch.at < 10_000) return;
      lastSearch = { query: key, at: Date.now() };
      tracker.track("search", { query: p.query, results: p.results });
    }),
    bus.subscribe("cart.open-requested", () => tracker.track("cart_view")),
    bus.subscribe("checkout.started", (p) => tracker.track("checkout_started", { count: p.count, total: p.total })),
    bus.subscribe("checkout.failed", (p) => tracker.track("checkout_failed", { code: p.code })),
    bus.subscribe("checkout.order-placed", (p) =>
      tracker.track("order_placed", {
        orderId: p.ref,
        total: p.total,
        subtotal: p.subtotal,
        shipping: p.shipping,
        discount: p.discount,
        promoCode: p.promoCode ?? "",
        express: Boolean(p.express),
        items: p.items,
      }),
    ),
    bus.subscribe("newsletter.subscribed", (p) => tracker.track("newsletter_signup", { source: p.source })),
    bus.subscribe("app.error-caught", (p) => tracker.track("page_error", { digest: p.digest, message: p.message })),
  ];
  return () => {
    for (const u of subs) u();
  };
}
