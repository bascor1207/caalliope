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
    const store = makeStore({
      bus,
      searchGateway: { search: async () => [] },
      catalogGateway: { listProducts: async () => [] },
      placeOrderGateway,
    });
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

  it("un ajout rapide depuis la collection remplit le panier et confirme par un toast, sans modale", () => {
    const { bus, store } = setup();
    bus.publish("catalog.product-chosen", {
      productId: "tee-koda",
      slug: "tee-koda",
      name: "Tee Koda",
      productType: "tee",
      colorKey: "sable",
      colorName: "Sable",
      colorHex: "#E8DCC8",
      size: "L",
      unitPrice: 38,
      qty: 1,
      source: "quick",
    });
    const state = store.getState();
    expect(selectCartCount(state)).toBe(1);
    expect(state.cart.isAddedDialogOpen).toBe(false);
    expect(state.notifications.toasts).toHaveLength(1);
    expect(state.notifications.toasts[0]).toMatchObject({
      kind: "cart-added",
      params: { name: "Tee Koda", color: "Sable", size: "L" },
      action: "open-cart",
    });
  });

  it("un achat express depuis la fiche ne vide pas le panier", () => {
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
      qty: 1,
    });
    bus.publish("checkout.order-placed", {
      ref: "KODA-9",
      total: 63.9,
      subtotal: 59,
      shipping: 4.9,
      discount: 0,
      email: "a@b.fr",
      items: [{ productId: "p", colorKey: "c", size: "M", qty: 1, price: 59 }],
      express: true,
    });
    expect(selectLines(store.getState())).toHaveLength(1);
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
    bus.publish("checkout.order-placed", {
      ref: "KODA-1001",
      total: 20,
      subtotal: 20,
      shipping: 0,
      discount: 0,
      email: "a@b.fr",
      items: [],
    });
    expect(selectLines(store.getState())).toHaveLength(0);
    expect(store.getState().notifications.toasts.at(-1)).toMatchObject({ kind: "order-placed" });
  });
});
