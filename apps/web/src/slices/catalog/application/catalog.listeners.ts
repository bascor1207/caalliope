import type { Dispatch, ListenerEffectAPI, UnknownAction } from "@reduxjs/toolkit";
import type { Locale } from "@/shared/kernel/locale";
import { catalogApi } from "./catalog.api";
import { catalogHydrated } from "./catalog.slice";

type StartListening = (options: {
  // biome-ignore lint/suspicious/noExplicitAny: signature générique du listener middleware RTK.
  matcher: any;
  // biome-ignore lint/suspicious/noExplicitAny: idem.
  effect: (action: any, api: ListenerEffectAPI<any, Dispatch<UnknownAction>, unknown>) => void;
}) => unknown;

/** Store → store : chaque relecture réussie du catalogue remplace le cache client (cartes, recos, recherche). */
export function registerCatalogListeners(startListening: StartListening) {
  startListening({
    matcher: catalogApi.endpoints.products.matchFulfilled,
    effect: (action, api) => {
      const locale = (action.meta.arg.originalArgs as { locale: Locale }).locale;
      api.dispatch(catalogHydrated({ locale, products: action.payload }));
    },
  });
}
