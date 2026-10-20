import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Locale } from "@/shared/kernel/locale";
import type { Product } from "../domain/product";
import type { SearchHit } from "../domain/search";
import type { CatalogGateway, SearchGateway } from "./ports";

interface CatalogApiDeps {
  searchGateway: SearchGateway;
  catalogGateway: CatalogGateway;
}

/**
 * RTK Query pour les lectures à la demande : recherche instantanée et relecture du catalogue.
 * Les gateways sont injectées via `extra` : l'application ne connaît pas le transport.
 * Le tag `Products` est invalidé par le flux temps réel (voir CatalogLive) : refetch en tâche de fond.
 */
export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fakeBaseQuery<string>(),
  keepUnusedDataFor: 300,
  tagTypes: ["Products"],
  endpoints: (build) => ({
    search: build.query<SearchHit[], { query: string; locale: Locale }>({
      queryFn: async ({ query, locale }, api) => {
        try {
          const { searchGateway } = api.extra as CatalogApiDeps;
          return { data: await searchGateway.search(query, locale) };
        } catch (error) {
          return { error: error instanceof Error ? error.message : "search-failed" };
        }
      },
    }),
    products: build.query<Product[], { locale: Locale }>({
      providesTags: ["Products"],
      queryFn: async ({ locale }, api) => {
        try {
          const { catalogGateway } = api.extra as CatalogApiDeps;
          return { data: await catalogGateway.listProducts(locale) };
        } catch (error) {
          return { error: error instanceof Error ? error.message : "catalog-failed" };
        }
      },
    }),
  }),
});

export const { useSearchQuery, useLazySearchQuery, useProductsQuery } = catalogApi;
export type CatalogApiState = ReturnType<typeof catalogApi.reducer>;
