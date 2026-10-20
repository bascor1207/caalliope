import type { Locale } from "@/shared/kernel/locale";
import type { Product } from "../domain/product";
import type { SearchHit } from "../domain/search";

/** Port de lecture du catalogue (serveur). Implémentation in-memory pour le POC, Shopify / DB ensuite. */
export interface CatalogRepository {
  listProducts(locale: Locale): Promise<Product[]>;
  getProductBySlug(slug: string, locale: Locale): Promise<Product | null>;
}

/** Port de recherche côté client (appelé par RTK Query). */
export interface SearchGateway {
  search(query: string, locale: Locale): Promise<SearchHit[]>;
}
