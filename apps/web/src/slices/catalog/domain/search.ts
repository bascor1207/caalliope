import type { Color, Product } from "./product";

export interface SearchHit {
  product: Product;
  color: Color;
}

const normalize = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Recherche plein texte naïve : nom, sous-titre, description, type et nom de coloris. Un hit par coloris. */
export function searchProducts(products: Product[], query: string, limit = 12): SearchHit[] {
  const q = normalize(query.trim());
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const product of products) {
    for (const color of product.colors) {
      const haystack = normalize(`${product.name} ${product.sub} ${product.description} ${color.name} ${product.type}`);
      if (haystack.includes(q)) hits.push({ product, color });
      if (hits.length >= limit) return hits;
    }
  }
  return hits;
}
