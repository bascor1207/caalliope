import type { Action, ThunkDispatch } from "@reduxjs/toolkit";
import type { EventBus } from "@/shared/event-bus";
import type { CartState } from "@/slices/cart/public-store";
import type { CatalogApiState, CatalogGateway, CatalogState, SearchGateway } from "@/slices/catalog/public-store";
import type { CheckoutState, PlaceOrderGateway } from "@/slices/checkout/public-store";
import type { NotificationsState } from "@/slices/notifications/public-store";

/** Dépendances injectées dans les thunks et RTK Query (`extra`) : les gateways, jamais les implémentations. */
export interface StoreDeps {
  bus: EventBus;
  searchGateway: SearchGateway;
  catalogGateway: CatalogGateway;
  placeOrderGateway: PlaceOrderGateway;
}

export interface RootState {
  catalog: CatalogState;
  catalogApi: CatalogApiState;
  cart: CartState;
  checkout: CheckoutState;
  notifications: NotificationsState;
}

export type AppDispatch = ThunkDispatch<RootState, StoreDeps, Action>;
