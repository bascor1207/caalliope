import type { Locale } from "@/shared/kernel/locale";
import type { CatalogRepository } from "../application/ports";
import type { Product } from "../domain/product";
import { type ColorSource, type ProductSource, resolveProduct } from "../domain/product-source";
import { PALETTE, PRODUCT_SOURCES } from "./catalog.data";

export class InMemoryCatalogRepository implements CatalogRepository {
  private readonly cache = new Map<Locale, Product[]>();

  constructor(
    private readonly sources: ProductSource[] = PRODUCT_SOURCES,
    private readonly palette: Record<string, ColorSource> = PALETTE,
  ) {}

  async listProducts(locale: Locale): Promise<Product[]> {
    let products = this.cache.get(locale);
    if (!products) {
      products = this.sources.map((s) => resolveProduct(s, this.palette, locale));
      this.cache.set(locale, products);
    }
    return products;
  }

  async getProductBySlug(slug: string, locale: Locale): Promise<Product | null> {
    return (await this.listProducts(locale)).find((p) => p.slug === slug) ?? null;
  }
}
