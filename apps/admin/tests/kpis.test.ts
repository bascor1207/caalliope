import { summarize } from "@koda/analytics";
import { describe, expect, it } from "vitest";
import { kpisOf } from "../src/lib/kpis";

describe("KPI du dashboard", () => {
  it("calcule conversion, panier moyen et taux d'étape", () => {
    const s = summarize([
      { name: "page_view", at: "2026-10-20T10:00:00Z", session: "a", path: "/", locale: "fr", props: {} },
      {
        name: "product_view",
        at: "2026-10-20T10:01:00Z",
        session: "a",
        path: "/p",
        locale: "fr",
        props: { productId: "x" },
      },
      {
        name: "product_chosen",
        at: "2026-10-20T10:02:00Z",
        session: "a",
        path: "/p",
        locale: "fr",
        props: { productId: "x" },
      },
      { name: "checkout_started", at: "2026-10-20T10:03:00Z", session: "a", path: "/c", locale: "fr", props: {} },
      {
        name: "order_placed",
        at: "2026-10-20T10:04:00Z",
        session: "a",
        path: "/c",
        locale: "fr",
        props: { total: 70 },
      },
      { name: "page_view", at: "2026-10-20T11:00:00Z", session: "b", path: "/", locale: "en", props: {} },
    ]);
    const byKey = Object.fromEntries(kpisOf(s).map((k) => [k.key, k]));
    expect(byKey.sessions.value).toBe("2");
    expect(byKey.conversion.value).toBe("50,0 %");
    expect(byKey.revenue.value).toContain("70");
    expect(byKey.revenue.hint).toContain("70");
    expect(byKey.orders.value).toBe("1");
  });
});
