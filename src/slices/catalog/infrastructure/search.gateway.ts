import type { SearchGateway } from "../application/ports";
import { searchProductsAction } from "./search.action";

/** Adapter client du port SearchGateway : appelle la Server Action. */
export const searchGateway: SearchGateway = {
  search: (query, locale) => searchProductsAction(query, locale),
};
