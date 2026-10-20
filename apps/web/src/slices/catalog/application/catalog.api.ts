import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Locale } from "@/shared/kernel/locale";
import type { SearchHit } from "../domain/search";
import type { SearchGateway } from "./ports";

interface CatalogApiDeps {
  searchGateway: SearchGateway;
}

/**
 * RTK Query pour les lectures à la demande (recherche instantanée).
 * La gateway est injectée via `extra` : l'application ne connaît pas le transport.
 */
export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fakeBaseQuery<string>(),
  keepUnusedDataFor: 120,
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
  }),
});

export const { useSearchQuery, useLazySearchQuery } = catalogApi;
export type CatalogApiState = ReturnType<typeof catalogApi.reducer>;
