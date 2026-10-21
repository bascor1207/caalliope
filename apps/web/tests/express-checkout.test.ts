import { describe, expect, it } from "vitest";
import {
  completeExpressOrder,
  lineFingerprint,
  prepareExpressPayment,
} from "@/slices/checkout/application/express-checkout";
import type { PaymentIntentState, PaymentProvider, PricingCatalog } from "@/slices/checkout/application/ports";
import { InMemoryOrdersRepository } from "@/slices/checkout/infrastructure/in-memory-orders.repository";

const line = { productId: "hoodie", colorKey: "sand", size: "M", qty: 1 };
const customer = {
  email: "lea@mail.fr",
  firstName: "Léa",
  lastName: "M",
  address: "12 rue",
  zip: "75002",
  city: "Paris",
};

const pricing: PricingCatalog = {
  price: async (lines) =>
    lines.map((l) =>
      l.productId === "hoodie"
        ? { ok: true, line: { ...l, name: "Hoodie", unitPrice: 59 } }
        : { ok: false, code: "unknown-product" },
    ),
};

/** Double du prestataire : mémorise les intentions et simule leur état. */
function fakePayments(state: Partial<PaymentIntentState> = {}) {
  const intents = new Map<string, PaymentIntentState>();
  const payments: PaymentProvider = {
    createIntent: async (input) => {
      const id = `pi_${intents.size + 1}`;
      intents.set(id, {
        id,
        status: "succeeded",
        amount: input.amount,
        currency: input.currency,
        metadata: input.metadata,
        wallet: "apple_pay",
        ...state,
      });
      return { id, clientSecret: `${id}_secret` };
    },
    retrieveIntent: async (id) => intents.get(id) ?? null,
  };
  return { payments, intents };
}

describe("prepareExpressPayment", () => {
  it("valorise côté serveur, livraison comprise, et crée l'intention en centimes", async () => {
    const { payments, intents } = fakePayments();
    const result = await prepareExpressPayment({ locale: "fr", line }, { pricing, payments });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.totals).toEqual({ subtotal: 59, shipping: 4.9, total: 63.9 });
    expect(intents.get(result.intentId)?.amount).toBe(6390);
    expect(intents.get(result.intentId)?.metadata.line).toBe(lineFingerprint(line));
  });

  it("refuse un produit inconnu sans créer d'intention", async () => {
    const { payments, intents } = fakePayments();
    const result = await prepareExpressPayment(
      { locale: "fr", line: { ...line, productId: "x" } },
      { pricing, payments },
    );
    expect(result).toEqual({ ok: false, code: "unknown-product" });
    expect(intents.size).toBe(0);
  });
});

describe("completeExpressOrder", () => {
  it("enregistre la commande payée par Apple Pay avec la référence du paiement", async () => {
    const { payments } = fakePayments();
    const orders = new InMemoryOrdersRepository();
    const prepared = await prepareExpressPayment({ locale: "fr", line }, { pricing, payments });
    if (!prepared.ok) throw new Error("prepare");
    const result = await completeExpressOrder(
      { locale: "fr", intentId: prepared.intentId, line, customer },
      { pricing, payments, orders },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order.payment).toBe("applepay");
    expect(result.order.paymentRef).toBe(prepared.intentId);
    expect(result.order.total).toBe(63.9);
    expect(await orders.findByRef(result.order.ref)).not.toBeNull();
  });

  it("refuse une intention non payée ou qui ne correspond pas à la ligne", async () => {
    const unpaid = fakePayments({ status: "requires_payment_method" });
    const orders = new InMemoryOrdersRepository();
    const prepared = await prepareExpressPayment({ locale: "fr", line }, { pricing, payments: unpaid.payments });
    if (!prepared.ok) throw new Error("prepare");
    const refused = await completeExpressOrder(
      { locale: "fr", intentId: prepared.intentId, line, customer },
      { pricing, payments: unpaid.payments, orders },
    );
    expect(refused).toEqual({ ok: false, errors: { cart: "payment-failed" } });

    const paid = fakePayments();
    const other = await prepareExpressPayment({ locale: "fr", line }, { pricing, payments: paid.payments });
    if (!other.ok) throw new Error("prepare");
    const mismatch = await completeExpressOrder(
      { locale: "fr", intentId: other.intentId, line: { ...line, size: "L" }, customer },
      { pricing, payments: paid.payments, orders },
    );
    expect(mismatch).toEqual({ ok: false, errors: { cart: "payment-failed" } });
    expect(await orders.findByRef("KODA-1")).toBeNull();
  });
});
