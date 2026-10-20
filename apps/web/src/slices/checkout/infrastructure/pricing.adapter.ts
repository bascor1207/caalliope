import type { CatalogRepository } from "@/slices/catalog/public-server";
import { isSizeAvailable } from "@/slices/catalog/public-types";
import type { PricedLine, PricingCatalog } from "../application/ports";

/**
 * Adapter du port PricingCatalog sur la slice catalogue (via son API publique uniquement).
 * C'est le seul endroit où le checkout "voit" le catalogue.
 */
export class CatalogPricingAdapter implements PricingCatalog {
  constructor(private readonly catalog: CatalogRepository) {}

  async price(
    lines: Parameters<PricingCatalog["price"]>[0],
    locale: Parameters<PricingCatalog["price"]>[1],
  ): Promise<PricedLine[]> {
    const products = await this.catalog.listProducts(locale);
    return lines.map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return { ok: false, code: "unknown-product" };
      if (!product.colors.some((c) => c.key === line.colorKey)) return { ok: false, code: "unavailable-color" };
      if (!isSizeAvailable(product, line.size, line.colorKey)) return { ok: false, code: "unavailable-size" };
      return { ok: true, line: { ...line, name: product.name, unitPrice: product.price } };
    });
  }
}
