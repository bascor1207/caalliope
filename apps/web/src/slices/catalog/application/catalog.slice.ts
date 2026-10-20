import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Locale } from "@/shared/kernel/locale";
import { type CatalogFilter, countByFilter, filterProducts, type Product } from "../domain/product";

/** Cache client du catalogue, hydraté depuis le rendu serveur (pas de refetch). */
export interface CatalogState {
  locale: Locale | null;
  products: Product[];
}

const initialState: CatalogState = { locale: null, products: [] };

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    catalogHydrated(state, action: PayloadAction<{ locale: Locale; products: Product[] }>) {
      state.locale = action.payload.locale;
      state.products = action.payload.products;
    },
  },
  selectors: {
    selectProducts: (state) => state.products,
    selectCatalogLocale: (state) => state.locale,
  },
});

export const { catalogHydrated } = catalogSlice.actions;
export const { selectProducts, selectCatalogLocale } = catalogSlice.selectors;

export const selectProductsByFilter = createSelector(
  [selectProducts, (_: { catalog: CatalogState }, filter: CatalogFilter) => filter],
  (products, filter) => filterProducts(products, filter),
);

export const selectFilterCounts = createSelector([selectProducts], countByFilter);

export const catalogReducer = catalogSlice.reducer;
