"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { eventBus } from "@/shared/event-bus";
import { bindCartToBus } from "@/slices/cart/public-store";
import { type CatalogState, catalogGateway, searchGateway } from "@/slices/catalog/public-store";
import { placeOrderGateway } from "@/slices/checkout/public-store";
import { bindNotificationsToBus } from "@/slices/notifications/public-store";
import { type AppStore, makeStore } from "./store";

interface Props {
  children: ReactNode;
  /** Catalogue rendu côté serveur, injecté comme état initial (le layout est remonté par locale). */
  catalog: CatalogState;
}

/**
 * Un store par arbre React (jamais partagé entre requêtes côté serveur),
 * et les ponts bus → store montés une fois côté client.
 */
export function StoreProvider({ children, catalog }: Props) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore({ bus: eventBus, searchGateway, catalogGateway, placeOrderGateway }, { catalog });
  }
  const store = storeRef.current;

  useEffect(() => {
    const unbind = [bindCartToBus(eventBus, store.dispatch), bindNotificationsToBus(eventBus, store.dispatch)];
    return () => {
      for (const u of unbind) u();
    };
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
