import type { Dispatch, TypedStartListening } from "@reduxjs/toolkit";
import type { EventBus } from "@/shared/event-bus";
import { countOf } from "../domain/cart";
import { type CartState, cleared, lineAdded, lineRemoved, qtySet } from "./cart.slice";

interface Deps {
  bus: EventBus;
}

/** Store → bus : le panier publie ses faits, sans savoir qui écoute. */
export function registerCartListeners<S extends { cart: CartState }, D extends Dispatch, E extends Deps>(
  startListening: TypedStartListening<S, D, E>,
) {
  startListening({
    actionCreator: lineAdded,
    effect: (action, api) => {
      const { line, qty = 1, quiet = false } = action.payload;
      api.extra.bus.publish("cart.line-added", {
        productId: line.productId,
        name: line.name,
        colorName: line.colorName,
        size: line.size,
        qty,
        count: countOf(api.getState().cart),
        quick: quiet,
      });
    },
  });
  /* Retrait d'une ligne (bouton « retirer », ou quantité ramenée à zéro) : un fait mesurable (panier abandonné ?). */
  startListening({
    predicate: (action) => lineRemoved.match(action) || qtySet.match(action),
    effect: (action, api) => {
      const key = (action as ReturnType<typeof lineRemoved>).payload.key;
      const before = api.getOriginalState().cart.lines.find((l) => l.key === key);
      const after = api.getState().cart.lines.find((l) => l.key === key);
      if (!before || after) return;
      api.extra.bus.publish("cart.line-removed", {
        productId: before.productId,
        colorKey: before.colorKey,
        size: before.size,
        qty: before.qty,
      });
    },
  });
  startListening({
    actionCreator: cleared,
    effect: (action, api) => api.extra.bus.publish("cart.cleared", { reason: action.payload.reason }),
  });
}
