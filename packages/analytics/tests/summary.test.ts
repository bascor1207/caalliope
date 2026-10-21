import { describe, expect, it } from "vitest";
import { type AnalyticsEvent, sanitizeEvents, summarize, top } from "../src";

const ev = (
  name: AnalyticsEvent["name"],
  props: AnalyticsEvent["props"] = {},
  session = "s1",
  at = "2026-10-20T10:00:00.000Z",
  path = "/",
): AnalyticsEvent => ({ name, props, session, path, locale: "fr", at });

describe("summarize", () => {
  it("agrège entonnoir, revenus, clics, langues et série journalière", () => {
    const range = { from: new Date("2026-10-19T00:00:00Z"), to: new Date("2026-10-20T23:59:59Z") };
    const s = summarize(
      [
        ev("page_view", {}, "s1", "2026-10-19T09:00:00Z"),
        ev("page_view", {}, "s2", "2026-10-20T09:00:00Z", "/produits/x"),
        ev("click", { target: "hero.cta" }, "s2"),
        ev("product_view", { productId: "x" }, "s2"),
        ev("product_chosen", { productId: "x" }, "s2"),
        ev("search", { query: "chaussettes", results: 0 }, "s2"),
        ev("checkout_started", { count: 1, total: 69.99 }, "s2"),
        ev("checkout_failed", { code: "invalid-zip" }, "s2"),
        ev("order_placed", { total: 69.99 }, "s2"),
      ],
      range,
    );
    expect(s.sessions).toBe(2);
    expect(s.funnel).toEqual({ productViews: 1, addToCart: 1, checkoutStarted: 1, ordersPlaced: 1 });
    expect(s.reached).toEqual({ productViews: 1, addToCart: 1, checkoutStarted: 1, ordersPlaced: 1 });
    expect(s.revenue).toBeCloseTo(69.99);
    expect(s.clicks).toEqual({ "hero.cta": 1 });
    expect(s.locales).toEqual({ fr: 2 });
    expect(s.frictions).toEqual({
      checkoutErrors: { "invalid-zip": 1 },
      searchesWithoutResult: 1,
      pageErrors: {},
      pageErrorCount: 0,
    });
    expect(s.daily).toEqual([
      { day: "2026-10-19", pageViews: 1, sessions: 1, orders: 0 },
      { day: "2026-10-20", pageViews: 1, sessions: 1, orders: 1 },
    ]);
    expect(top({ a: 1, b: 3, c: 2 }, 2)).toEqual([
      ["b", 3],
      ["c", 2],
    ]);
  });
});

describe("sanitizeEvents", () => {
  const now = () => new Date("2026-10-20T12:00:00Z");
  it("rejette les noms inconnus, borne les propriétés et garde un horodatage récent", () => {
    const events = sanitizeEvents(
      [
        { name: "hack", session: "s" },
        {
          name: "page_view",
          session: "s",
          path: "/",
          locale: "fr",
          at: "2026-10-18T12:00:00Z",
          props: { a: "x".repeat(500), b: 1, c: {} },
        },
        { name: "click", session: "s", at: "1999-01-01T00:00:00Z", props: { target: "t" } },
        "nope",
      ],
      { now },
    );
    expect(events.map((e) => e.name)).toEqual(["page_view", "click"]);
    expect(events[0].at).toBe("2026-10-18T12:00:00.000Z");
    expect((events[0].props.a as string).length).toBe(120);
    expect(events[0].props).not.toHaveProperty("c");
    expect(events[1].at).toBe("2026-10-20T12:00:00.000Z");
  });
});

describe("ventilations commerce", () => {
  const ev = (
    name: AnalyticsEvent["name"],
    session: string,
    props: AnalyticsEvent["props"] = {},
    at = "2026-10-21T10:00:00.000Z",
  ): AnalyticsEvent => ({
    name,
    at,
    session,
    path: "/",
    locale: "fr",
    props,
  });
  it("attribue les sessions et les ventes à une source, ventile par coloris, taille, rupture et promo", () => {
    const s = summarize([
      ev("session_start", "a", { source: "tiktok", campaign: "drop-casquette", referrer: "https://www.tiktok.com/" }),
      ev("page_view", "a"),
      ev("product_view", "a", { productId: "cap", colorKey: "navy" }),
      ev("size_selected", "a", { productId: "cap", colorKey: "navy", size: "TU" }),
      ev("add_to_cart", "a", { productId: "cap", colorKey: "navy", size: "TU", price: 29.9 }),
      ev("soldout_click", "a", { productId: "hoodie", colorKey: "rose", size: "L" }),
      ev("cart_view", "a"),
      ev("checkout_started", "a"),
      ev("order_placed", "a", {
        orderId: "KODA-1",
        total: 54.8,
        subtotal: 59.8,
        shipping: 0,
        discount: 5,
        promoCode: "DROP10",
        items: [
          { productId: "cap", colorKey: "navy", size: "TU", qty: 1, price: 29.9 },
          { productId: "cap", colorKey: "noir", size: "TU", qty: 1, price: 29.9 },
        ],
      }),
      ev("page_view", "b", { referrer: "https://www.instagram.com/" }),
      ev("product_view", "b", { productId: "cap", colorKey: "navy" }),
      ev("remove_from_cart", "b", { productId: "cap" }),
      ev("newsletter_signup", "b", { source: "notify" }),
      ev("page_view", "c"),
    ]);
    expect(s.sources).toEqual({
      tiktok: { sessions: 1, orders: 1, revenue: 54.8 },
      "instagram.com": { sessions: 1, orders: 0, revenue: 0 },
      direct: { sessions: 1, orders: 0, revenue: 0 },
    });
    expect(s.campaigns["drop-casquette"]).toEqual({ sessions: 1, orders: 1, revenue: 54.8 });
    expect(s.colors["cap|navy"]).toEqual({
      productId: "cap",
      colorKey: "navy",
      views: 2,
      addToCart: 1,
      orders: 1,
      units: 1,
    });
    expect(s.colors["cap|noir"].orders).toBe(1);
    expect(s.sizes["cap|TU"]).toEqual({ selected: 1, addToCart: 1 });
    expect(s.soldOutClicks).toEqual({ "hoodie|rose|L": 1 });
    expect(s.cart).toEqual({ views: 1, removals: 1, removalsByProduct: { cap: 1 } });
    expect(s.baskets).toEqual({ orders: 1, averageBasket: 54.8, itemsPerOrder: 2, multiItemShare: 1, discount: 5 });
    expect(s.promos).toEqual({ DROP10: { orders: 1, revenue: 54.8, discount: 5 } });
    expect(s.newsletterSignups).toEqual({ notify: 1 });
  });

  it("garde les lignes de commande dans le nettoyage et borne leur nombre", () => {
    const [e] = sanitizeEvents(
      [
        {
          name: "order_placed",
          session: "s",
          props: {
            total: 10,
            items: Array.from({ length: 40 }, (_, i) => ({ productId: `p${i}`, qty: 1, nested: { no: true } })),
          },
        },
      ],
      { now: () => new Date("2026-10-21T10:00:00.000Z") },
    );
    expect(Array.isArray(e.props.items)).toBe(true);
    expect((e.props.items as unknown[]).length).toBe(30);
    expect((e.props.items as Array<Record<string, unknown>>)[0]).toEqual({ productId: "p0", qty: 1 });
  });
});
