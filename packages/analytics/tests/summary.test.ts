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
    expect(s.revenue).toBeCloseTo(69.99);
    expect(s.clicks).toEqual({ "hero.cta": 1 });
    expect(s.locales).toEqual({ fr: 2 });
    expect(s.frictions).toEqual({ checkoutErrors: { "invalid-zip": 1 }, searchesWithoutResult: 1 });
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
