import { describe, expect, it } from "vitest";
import { placeOrder } from "@/slices/checkout/application/place-order";
import type { PricingCatalog } from "@/slices/checkout/application/ports";
import { validateCustomer } from "@/slices/checkout/domain/order";
import { InMemoryOrdersRepository } from "@/slices/checkout/infrastructure/in-memory-orders.repository";

const customer = {
  email: "lea@mail.fr",
  firstName: "Léa",
  lastName: "M",
  address: "12 rue de la Paix",
  zip: "75002",
  city: "Paris",
};

/** Double du port PricingCatalog : le checkout est testé sans le catalogue. */
const pricing: PricingCatalog = {
  price: async (lines) =>
    lines.map((l) =>
      l.productId === "sold-out"
        ? { ok: false, code: "unavailable-size" }
        : { ok: true, line: { ...l, name: l.productId, unitPrice: l.productId === "hoodie" ? 68 : 38 } },
    ),
};

const deps = () => ({ orders: new InMemoryOrdersRepository(), pricing, now: () => new Date("2026-10-20T10:00:00Z") });

describe("validateCustomer", () => {
  it("renvoie des codes d'erreur, pas des messages", () => {
    expect(validateCustomer(customer)).toEqual({});
    expect(validateCustomer({ ...customer, email: "nope", zip: "7500", city: " " })).toEqual({
      email: "invalid-email",
      zip: "invalid-zip",
      city: "required",
    });
  });
});

describe("placeOrder", () => {
  it("valorise les lignes via le port et persiste la commande", async () => {
    const d = deps();
    const result = await placeOrder(
      {
        locale: "fr",
        customer,
        payment: "card",
        lines: [
          { productId: "hoodie", colorKey: "sauge", size: "M", qty: 1 },
          { productId: "tee", colorKey: "ciel", size: "L", qty: 1 },
        ],
      },
      d,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order).toMatchObject({
      ref: "KODA-1001",
      subtotal: 106,
      shipping: 0,
      total: 106,
      createdAt: "2026-10-20T10:00:00.000Z",
    });
    expect(await d.orders.findByRef("KODA-1001")).not.toBeNull();
  });

  it("refuse un panier vide, une quantité invalide et une taille épuisée", async () => {
    const empty = await placeOrder({ locale: "fr", customer, payment: "card", lines: [] }, deps());
    expect(!empty.ok && empty.errors.cart).toBe("empty-cart");
    const qty = await placeOrder(
      {
        locale: "fr",
        customer,
        payment: "card",
        lines: [{ productId: "hoodie", colorKey: "sauge", size: "M", qty: 0 }],
      },
      deps(),
    );
    expect(!qty.ok && qty.errors.cart).toBe("invalid-qty");
    const soldOut = await placeOrder(
      {
        locale: "fr",
        customer,
        payment: "card",
        lines: [{ productId: "sold-out", colorKey: "sauge", size: "XXL", qty: 1 }],
      },
      deps(),
    );
    expect(!soldOut.ok && soldOut.errors.cart).toBe("unavailable-size");
  });
});
