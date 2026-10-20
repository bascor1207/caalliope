import { type AnalyticsEvent, summarize } from "@koda/analytics";
import { describe, expect, it, vi } from "vitest";
import { createEventBus } from "@/shared/event-bus";
import { bindAnalyticsToBus, createTracker } from "@/slices/analytics/application/tracker";
import { clickTarget, sessionIdFrom } from "@/slices/analytics/domain/analytics";

const ev = (
  name: AnalyticsEvent["name"],
  props: AnalyticsEvent["props"] = {},
  session = "s1",
  path = "/",
): AnalyticsEvent => ({
  name,
  props,
  session,
  path,
  locale: "fr",
  at: "2026-10-20T10:00:00Z",
});

describe("analytics : synthèse", () => {
  it("agrège pages vues, entonnoir et frictions", () => {
    const s = summarize([
      ev("page_view"),
      ev("page_view", {}, "s2", "/produits/pull-a-capuche-koda"),
      ev("product_view", { productId: "pull-a-capuche-koda" }),
      ev("product_chosen", { productId: "pull-a-capuche-koda" }),
      ev("search", { query: "chaussettes", results: 0 }),
      ev("checkout_started", { count: 1, total: 69.99 }),
      ev("checkout_failed", { code: "invalid-zip" }),
      ev("order_placed", { total: 69.99 }),
    ]);
    expect(s.sessions).toBe(2);
    expect(s.pageViews).toEqual({ "/": 1, "/produits/pull-a-capuche-koda": 1 });
    expect(s.funnel).toEqual({ productViews: 1, addToCart: 1, checkoutStarted: 1, ordersPlaced: 1 });
    expect(s.frictions).toEqual({
      checkoutErrors: { "invalid-zip": 1 },
      searchesWithoutResult: 1,
      pageErrors: {},
      pageErrorCount: 0,
    });
    expect(s.searches.noResult).toEqual({ chaussettes: 1 });
  });

  it("remonte la cible data-track la plus proche d'un clic", () => {
    const button = { getAttribute: (n: string) => (n === "data-track" ? "hero.cta" : null) };
    expect(clickTarget({ closest: () => button })).toBe("hero.cta");
    expect(clickTarget({ closest: () => null })).toBeNull();
  });

  it("réutilise l'identifiant de session stocké", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    expect(sessionIdFrom(storage, () => "abc")).toBe("abc");
    expect(sessionIdFrom(storage, () => "xyz")).toBe("abc");
  });
});

describe("analytics : traceur branché sur le bus", () => {
  it("transforme les faits du bus en événements et les envoie par lots", () => {
    vi.useFakeTimers();
    const sent: AnalyticsEvent[][] = [];
    const tracker = createTracker(
      { send: (e) => sent.push(e) },
      { session: "s", locale: "fr", path: () => "/p", now: () => "t" },
      100,
    );
    const bus = createEventBus(new EventTarget());
    bindAnalyticsToBus(bus, tracker);
    bus.publish("catalog.product-viewed", { productId: "p", slug: "p", colorKey: "rose" });
    bus.publish("catalog.search-performed", { query: "x", results: 0 });
    expect(sent).toHaveLength(0);
    vi.advanceTimersByTime(150);
    expect(sent).toHaveLength(1);
    expect(sent[0].map((e) => e.name)).toEqual(["product_view", "search"]);
    vi.useRealTimers();
  });
});
