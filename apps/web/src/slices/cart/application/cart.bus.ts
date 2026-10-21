import type { Dispatch } from "@reduxjs/toolkit";
import type { EventBus, Unsubscribe } from "@/shared/event-bus";
import { cleared, lineAdded, opened } from "./cart.slice";

/** Bus → store : le panier réagit aux faits des autres slices (catalogue, checkout, notifications). */
export function bindCartToBus(bus: EventBus, dispatch: Dispatch): Unsubscribe {
  const subscriptions = [
    bus.subscribe("catalog.product-chosen", (p) => {
      dispatch(
        lineAdded({
          line: {
            productId: p.productId,
            slug: p.slug,
            name: p.name,
            productType: p.productType,
            colorKey: p.colorKey,
            colorName: p.colorName,
            colorHex: p.colorHex,
            imageSrc: p.imageSrc,
            size: p.size,
            unitPrice: p.unitPrice,
          },
          qty: p.qty,
          quiet: p.source === "quick",
        }),
      );
    }),
    bus.subscribe("cart.open-requested", () => dispatch(opened())),
    /* Un achat express (depuis la fiche) ne touche pas au panier : seules les commandes du panier le vident. */
    bus.subscribe("checkout.order-placed", (p) => {
      if (!p.express) dispatch(cleared({ reason: "order-placed" }));
    }),
  ];
  return () => {
    for (const unsubscribe of subscriptions) unsubscribe();
  };
}
