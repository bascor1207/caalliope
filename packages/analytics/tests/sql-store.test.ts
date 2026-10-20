import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type AnalyticsStore, createSqlStore } from "../src";

/** Le même SQL que Neon en production, exécuté par un Postgres embarqué (WASM) : aucun service à lancer. */
describe("store SQL (Postgres)", () => {
  let db: PGlite;
  let store: AnalyticsStore;
  beforeAll(async () => {
    db = new PGlite();
    store = createSqlStore(async (text, params) => (await db.query(text, params)).rows as Record<string, unknown>[]);
  });
  afterAll(() => db.close());

  it("crée le schéma, écrit par lots et relit par période", async () => {
    await store.append([
      { name: "page_view", at: "2026-10-01T10:00:00.000Z", session: "a", path: "/", locale: "fr", props: {} },
      {
        name: "order_placed",
        at: "2026-10-15T10:00:00.000Z",
        session: "a",
        path: "/commande",
        locale: "fr",
        props: { total: 69.99 },
      },
      { name: "page_view", at: "2026-11-01T10:00:00.000Z", session: "b", path: "/en", locale: "en", props: {} },
    ]);
    const october = await store.read({ from: new Date("2026-10-01T00:00:00Z"), to: new Date("2026-10-31T23:59:59Z") });
    expect(october.map((e) => e.name)).toEqual(["page_view", "order_placed"]);
    expect(october[1].props).toEqual({ total: 69.99 });
    expect(october[1].at).toBe("2026-10-15T10:00:00.000Z");
  });

  it("ne rejoue pas le DDL quand la table existe déjà", async () => {
    const calls: string[] = [];
    const again = createSqlStore(async (text, params) => {
      calls.push(text);
      return (await db.query(text, params)).rows as Record<string, unknown>[];
    });
    await again.read({ from: new Date("2026-10-01T00:00:00Z"), to: new Date("2026-10-02T00:00:00Z") });
    expect(calls.some((c) => c.startsWith("CREATE TABLE"))).toBe(false);
    expect(calls[0]).toContain("to_regclass");
  });

  it("écrit des lots de plus de 100 événements en plusieurs requêtes", async () => {
    const many = Array.from({ length: 250 }, (_, i) => ({
      name: "click" as const,
      at: new Date(Date.UTC(2027, 0, 1, 0, i)).toISOString(),
      session: `s${i % 7}`,
      path: "/",
      locale: "fr",
      props: { target: `t${i % 3}` },
    }));
    await store.append(many);
    const read = await store.read({ from: new Date("2027-01-01T00:00:00Z"), to: new Date("2027-01-02T00:00:00Z") });
    expect(read).toHaveLength(250);
  });
});
