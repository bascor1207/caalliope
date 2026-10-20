import type { Locale } from "@/shared/kernel/locale";
import type { Product } from "../domain/product";
import type { SearchHit } from "../domain/search";

/** Port de lecture du catalogue (serveur). Implémentation in-memory pour le POC, Shopify / DB ensuite. */
export interface CatalogRepository {
  listProducts(locale: Locale): Promise<Product[]>;
  getProductBySlug(slug: string, locale: Locale): Promise<Product | null>;
  /** Lecture sans cache, pour la relecture temps réel côté client. Par défaut : listProducts. */
  listProductsFresh?(locale: Locale): Promise<Product[]>;
}

/** Port de lecture du catalogue côté client (RTK Query) : relecture fraîche après un changement en base. */
export interface CatalogGateway {
  listProducts(locale: Locale): Promise<Product[]>;
}

/** Port de recherche côté client (appelé par RTK Query). */
export interface SearchGateway {
  search(query: string, locale: Locale): Promise<SearchHit[]>;
}
