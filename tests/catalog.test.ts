import { describe, expect, it } from "vitest";
import { countByFilter, isSizeAvailable, pickColor } from "@/slices/catalog/domain/product";
import { resolveProduct } from "@/slices/catalog/domain/product-source";
import { searchProducts } from "@/slices/catalog/domain/search";
import { PALETTE, PRODUCT_SOURCES } from "@/slices/catalog/infrastructure/catalog.data";

const fr = PRODUCT_SOURCES.map((s) => resolveProduct(s, PALETTE, "fr"));
const en = PRODUCT_SOURCES.map((s) => resolveProduct(s, PALETTE, "en"));

describe("domaine catalogue", () => {
  it("résout les sources dans chaque locale", () => {
    expect(fr[0].name).toBe("Hoodie Origine");
    expect(en[0].name).toBe("Origine Hoodie");
    expect(fr[0].colors.map((c) => c.name)).toEqual(["Sauge", "Lavande", "Sable"]);
    expect(en[0].colors.map((c) => c.name)).toEqual(["Sage", "Lavender", "Sand"]);
  });

  it("compte par filtre et gère les ruptures", () => {
    expect(countByFilter(fr)).toEqual({ all: 6, hoodie: 2, tee: 2, more: 2 });
    expect(isSizeAvailable(fr[0], "M")).toBe(true);
    expect(isSizeAvailable(fr[0], "XXL")).toBe(false);
  });

  it("retombe sur le premier coloris si celui demandé n'existe pas", () => {
    expect(pickColor(fr[0], "lavande").key).toBe("lavande");
    expect(pickColor(fr[0], "rose").key).toBe("sauge");
  });

  it("cherche sans tenir compte des accents ni de la casse, dans la langue du catalogue", () => {
    expect(searchProducts(fr, "LAVANDE").every((h) => h.color.key === "lavande")).toBe(true);
    expect(searchProducts(en, "lavender").length).toBeGreaterThan(0);
    expect(searchProducts(fr, "   ")).toEqual([]);
  });
});
