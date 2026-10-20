import { describe, expect, it } from "vitest";
import { createEventBus } from "@/shared/event-bus";
import { bindCartToBus, selectCartCount, selectLines } from "@/slices/cart/public-store";
import type { PlaceOrderGateway } from "@/slices/checkout/public-store";
import { bindNotificationsToBus } from "@/slices/notifications/public-store";
import { makeStore } from "@/store/store";

/**
 * Intégration : le catalogue publie, le panier s'abonne, les notifications réagissent,
 * le checkout vide le panier. Aucune slice n'importe une autre.
 */
describe("bus ↔ store", () => {
  const setup = () => {
    const bus = createEventBus(new EventTarget());
    const placeOrderGateway: PlaceOrderGateway = {
      place: async () => ({ ok: false, errors: { cart: "network" } }),
    };
    const store = makeStore({ bus, searchGateway: { search: async () => [] }, placeOrderGateway });
    bindCartToBus(bus, store.dispatch);
    bindNotificationsToBus(bus, store.dispatch);
    return { bus, store };
  };

  it("un produit choisi dans le catalogue atterrit dans le panier et ouvre la modale de confirmation", () => {
    const { bus, store } = setup();
    bus.publish("catalog.product-chosen", {
      productId: "pull-a-capuche-koda",
      slug: "pull-a-capuche-koda",
      name: "Pull à capuche Koda",
      productType: "hoodie",
      colorKey: "bleu-ciel",
      colorName: "Bleu ciel",
      colorHex: "#BFD6EA",
      size: "M",
      unitPrice: 68,
      qty: 1,
    });
    const state = store.getState();
    expect(selectCartCount(state)).toBe(1);
    expect(state.cart.isOpen).toBe(false);
    expect(state.cart.isAddedDialogOpen).toBe(true);
    expect(state.cart.lastAdded).toMatchObject({
      name: "Pull à capuche Koda",
      colorName: "Bleu ciel",
      size: "M",
      qty: 1,
    });
    expect(state.notifications.toasts).toHaveLength(0);
  });

  it("une commande passée vide le panier", () => {
    const { bus, store } = setup();
    bus.publish("catalog.product-chosen", {
      productId: "p",
      slug: "p",
      name: "P",
      productType: "tee",
      colorKey: "c",
      colorName: "C",
      colorHex: "#fff",
      size: "M",
      unitPrice: 10,
      qty: 2,
    });
    expect(selectLines(store.getState())).toHaveLength(1);
    bus.publish("checkout.order-placed", { ref: "KODA-1001", total: 20, email: "a@b.fr" });
    expect(selectLines(store.getState())).toHaveLength(0);
    expect(store.getState().notifications.toasts.at(-1)).toMatchObject({ kind: "order-placed" });
  });
});
