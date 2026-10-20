/** Interface publique serveur de la slice catalogue : lecture du catalogue et SEO. */
export type { CatalogRepository } from "./application/ports";
export { getProduct, getProductWithRelated, listProducts, search } from "./application/use-cases";
export { catalogRepository } from "./infrastructure/container";
export { itemListJsonLd, productJsonLd } from "./ui/product-jsonld";
