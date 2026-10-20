import type { Locale } from "@/shared/kernel/locale";
import { type Product, relatedProducts } from "../domain/product";
import { type SearchHit, searchProducts } from "../domain/search";
import type { CatalogRepository } from "./ports";

export const listProducts = (repo: CatalogRepository, locale: Locale): Promise<Product[]> => repo.listProducts(locale);

export const getProduct = (repo: CatalogRepository, slug: string, locale: Locale): Promise<Product | null> =>
  repo.getProductBySlug(slug, locale);

export async function getProductWithRelated(repo: CatalogRepository, slug: string, locale: Locale) {
  const product = await repo.getProductBySlug(slug, locale);
  if (!product) return null;
  const all = await repo.listProducts(locale);
  return { product, related: relatedProducts(all, product) };
}

export async function search(
  repo: CatalogRepository,
  query: string,
  locale: Locale,
  limit?: number,
): Promise<SearchHit[]> {
  const products = await repo.listProducts(locale);
  return searchProducts(products, query, limit);
}
