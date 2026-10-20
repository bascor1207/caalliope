/**
 * Interface publique (types & règles pures) de la slice catalogue.
 * Consommable par n'importe qui : aucune dépendance runtime.
 */
export {
  type CatalogFilter,
  type Color,
  isCatalogFilter,
  isSizeAvailable,
  type Product,
  type ProductType,
  pickColor,
} from "./domain/product";
export type { SearchHit } from "./domain/search";
