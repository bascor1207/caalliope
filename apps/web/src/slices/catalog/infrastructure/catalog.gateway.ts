import type { CatalogGateway } from "../application/ports";
import type { Product } from "../domain/product";

/** Adapter client du port CatalogGateway : lit la route /api/catalog (toujours fraîche, jamais mise en cache). */
export const catalogGateway: CatalogGateway = {
  async listProducts(locale) {
    const res = await fetch(`/api/catalog?locale=${locale}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`catalog ${res.status}`);
    const { products } = (await res.json()) as { products: Product[] };
    return products;
  },
};
