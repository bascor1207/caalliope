/** Interface publique store de la slice catalogue : reducers, RTK Query, gateway client. */
export { type CatalogApiState, catalogApi } from "./application/catalog.api";
export { type CatalogState, catalogReducer, selectProducts } from "./application/catalog.slice";
export type { SearchGateway } from "./application/ports";
export { searchGateway } from "./infrastructure/search.gateway";
