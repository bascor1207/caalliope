import { describe, expect, it } from "vitest";
import {
  complementaryProducts,
  countByFilter,
  imageFor,
  isSizeAvailable,
  pickColor,
} from "@/slices/catalog/domain/product";
import { resolveProduct } from "@/slices/catalog/domain/product-source";
import { searchProducts } from "@/slices/catalog/domain/search";
import { PALETTE, PRODUCT_SOURCES } from "@/slices/catalog/infrastructure/catalog.data";

const fr = PRODUCT_SOURCES.map((s) => resolveProduct(s, PALETTE, "fr"));
const en = PRODUCT_SOURCES.map((s) => resolveProduct(s, PALETTE, "en"));
const hoodie = fr.find((p) => p.id === "pull-a-capuche-koda");
const tee = fr.find((p) => p.id === "t-shirt-koda");
if (!hoodie || !tee) throw new Error("fixtures manquantes");

describe("domaine catalogue (données KODA)", () => {
  it("résout les sources dans chaque locale", () => {
    expect(hoodie.name).toBe("Pull à capuche Koda");
    expect(en.find((p) => p.id === "pull-a-capuche-koda")?.name).toBe("Koda Hoodie");
    expect(hoodie.colors.map((c) => c.name)).toEqual(["Bleu ciel", "Rose", "Beige", "Blanc", "Navy", "Violet"]);
    expect(en.find((p) => p.id === "pull-a-capuche-koda")?.colors[0].name).toBe("Sky blue");
  });

  it("compte par filtre : trois familles, quinze coloris", () => {
    expect(countByFilter(fr)).toEqual({ all: 3, hoodie: 1, sweat: 1, tee: 1 });
    expect(fr.reduce((n, p) => n + p.colors.length, 0)).toBe(15);
  });

  it("chaque coloris a ses photos", () => {
    for (const product of fr) {
      for (const color of product.colors) {
        expect(imageFor(product, color.key)?.colorKey).toBe(color.key);
        expect(product.images.filter((i) => i.colorKey === color.key)).toHaveLength(2);
      }
    }
  });

  it("gère les ruptures par coloris", () => {
    expect(isSizeAvailable(hoodie, "2XL", "rose")).toBe(false);
    expect(isSizeAvailable(hoodie, "2XL", "navy")).toBe(true);
    expect(isSizeAvailable(hoodie, "M", "rose")).toBe(true);
    expect(isSizeAvailable(tee, "2XL")).toBe(false);
  });

  it("retombe sur le premier coloris si celui demandé n'existe pas", () => {
    expect(pickColor(hoodie, "navy").key).toBe("navy");
    expect(pickColor(hoodie, "sauge").key).toBe("bleu-ciel");
  });

  it("cherche sans tenir compte des accents ni de la casse, dans la langue du catalogue", () => {
    expect(searchProducts(fr, "BLEU CIEL").every((h) => h.color.key === "bleu-ciel")).toBe(true);
    expect(searchProducts(en, "sky blue").length).toBeGreaterThan(0);
    expect(searchProducts(fr, "capuche")[0]?.product.id).toBe("pull-a-capuche-koda");
    expect(searchProducts(fr, "   ")).toEqual([]);
  });
});

describe("catalogue : « Parfait avec »", () => {
  const products = PRODUCT_SOURCES.map((s) => resolveProduct(s, PALETTE, "fr"));

  it("propose d'autres types de pièces d'abord, dans le même coloris quand il existe", () => {
    const hoodie = products.find((p) => p.type === "hoodie");
    if (!hoodie) throw new Error("pas de hoodie dans le catalogue");
    const color = hoodie.colors[0].key;
    const suggestions = complementaryProducts(products, hoodie.id, color);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.every((s) => s.product.id !== hoodie.id)).toBe(true);
    expect(suggestions[0].product.type).not.toBe("hoodie");
    for (const s of suggestions) {
      const hasColor = s.product.colors.some((c) => c.key === color);
      expect(s.colorKey).toBe(hasColor ? color : s.product.colors[0].key);
    }
  });
});
