/** Interface publique serveur de la slice catalogue : lecture du catalogue et SEO. */
export type { CatalogRepository } from "./application/ports";
export { getProduct, getProductWithRelated, listProducts, search } from "./application/use-cases";
export type { ColorSource, ProductSource } from "./domain/product-source";
export { PALETTE, PRODUCT_SOURCES } from "./infrastructure/catalog.data";
export { catalogRepository } from "./infrastructure/container";
export { itemListJsonLd, productJsonLd } from "./ui/product-jsonld";
