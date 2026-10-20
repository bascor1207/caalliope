import { combineReducers, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { cartReducer, registerCartListeners } from "@/slices/cart/public-store";
import { catalogApi, catalogReducer } from "@/slices/catalog/public-store";
import { checkoutReducer, registerCheckoutListeners } from "@/slices/checkout/public-store";
import { notificationsReducer } from "@/slices/notifications/public-store";
import type { AppStartListening } from "./listener";
import type { AppDispatch, RootState, StoreDeps } from "./types";

const rootReducer = combineReducers({
  catalog: catalogReducer,
  [catalogApi.reducerPath]: catalogApi.reducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  notifications: notificationsReducer,
});

/**
 * Composition root du store : seules les slices (via leur index public) sont connues ici.
 * Un listener middleware par store, avec les dépendances injectées dans `extra`.
 * L'état initial (catalogue rendu côté serveur) est fourni à la création : aucun dispatch pendant le rendu.
 */
export function makeStore(deps: StoreDeps, preloadedState?: Partial<RootState>) {
  const listener = createListenerMiddleware<RootState, AppDispatch, StoreDeps>({ extra: deps });
  const startListening = listener.startListening as AppStartListening;
  registerCartListeners(startListening);
  registerCheckoutListeners(startListening);
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) =>
      getDefault({ thunk: { extraArgument: deps } })
        .prepend(listener.middleware)
        .concat(catalogApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
