import { getSql } from "@koda/db";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/shared/kernel/locale";
import type { CatalogRepository } from "../application/ports";
import type { Product } from "../domain/product";
import { type ColorSource, type ProductSource, resolveProduct } from "../domain/product-source";
import { PALETTE, PRODUCT_SOURCES } from "./catalog.data";

interface Row {
  id: string;
  slug: string;
  data: Omit<ProductSource, "id" | "slug">;
}

/**
 * Sources du catalogue édité dans le back-office (`catalog_products`, palette dans `site_settings`).
 * Cache 5 min, invalidé immédiatement par l'admin (tag `catalog`). Table vide ou base en panne : catalogue du code.
 */
const loadSources = unstable_cache(
  async (): Promise<{ sources: ProductSource[]; palette: Record<string, ColorSource> }> => {
    try {
      const sql = getSql();
      const [rows, settings] = await Promise.all([
        sql<Row[]>`SELECT id, slug, data FROM catalog_products WHERE active ORDER BY sort, created_at`,
        sql<{ value: Record<string, ColorSource> }[]>`SELECT value FROM site_settings WHERE key = 'catalog.palette'`,
      ]);
      const palette = { ...PALETTE, ...(settings[0]?.value ?? {}) };
      if (rows.length === 0) return { sources: PRODUCT_SOURCES, palette };
      return { sources: rows.map((r) => ({ ...r.data, id: r.id, slug: r.slug })), palette };
    } catch {
      return { sources: PRODUCT_SOURCES, palette: PALETTE };
    }
  },
  ["catalog-sources"],
  { tags: ["catalog"], revalidate: 300 },
);

export class PostgresCatalogRepository implements CatalogRepository {
  async listProducts(locale: Locale): Promise<Product[]> {
    const { sources, palette } = await loadSources();
    return sources.map((s) => resolveProduct(s, palette, locale));
  }

  async getProductBySlug(slug: string, locale: Locale): Promise<Product | null> {
    return (await this.listProducts(locale)).find((p) => p.slug === slug) ?? null;
  }
}
