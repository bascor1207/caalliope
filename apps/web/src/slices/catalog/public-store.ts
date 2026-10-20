/** Interface publique store de la slice catalogue : reducers, RTK Query, gateway client. */
export { type CatalogApiState, catalogApi } from "./application/catalog.api";
export { registerCatalogListeners } from "./application/catalog.listeners";
export { type CatalogState, catalogReducer, selectProducts } from "./application/catalog.slice";
export type { CatalogGateway, SearchGateway } from "./application/ports";
export { catalogGateway } from "./infrastructure/catalog.gateway";
export { searchGateway } from "./infrastructure/search.gateway";
