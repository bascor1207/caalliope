import type { Locale } from "@/shared/kernel/locale";
import { type Totals, totalsFor } from "@/shared/kernel/shipping-policy";
import type { Customer, OrderLineInput, PaymentMethod } from "../domain/order";
import { placeOrder } from "./place-order";
import type { OrdersRepository, PaymentProvider, PlaceOrderResult, PricingCatalog } from "./ports";

const CURRENCY = "eur";

/** Empreinte de la ligne achetée, stockée dans l'intention : la commande finale doit la retrouver à l'identique. */
export const lineFingerprint = (line: OrderLineInput) => `${line.productId}|${line.colorKey}|${line.size}|${line.qty}`;

export const toCents = (amount: number) => Math.round(amount * 100);

type LineCode = "unknown-product" | "unavailable-color" | "unavailable-size" | "invalid-qty" | "network";
const LINE_CODES: string[] = ["unknown-product", "unavailable-color", "unavailable-size", "invalid-qty", "network"];

export type PrepareResult =
  | { ok: true; clientSecret: string; intentId: string; totals: Totals }
  | { ok: false; code: LineCode };

/**
 * Achat express (Apple Pay / Google Pay depuis la fiche) : le serveur valorise la ligne, calcule la livraison et
 * crée l'intention de paiement. Le client ne fixe jamais le montant.
 */
export async function prepareExpressPayment(
  input: { locale: Locale; line: OrderLineInput },
  deps: { pricing: PricingCatalog; payments: PaymentProvider },
): Promise<PrepareResult> {
  const [priced] = await deps.pricing.price([input.line], input.locale);
  if (!priced) return { ok: false, code: "unknown-product" };
  if (!priced.ok) return { ok: false, code: LINE_CODES.includes(priced.code) ? (priced.code as LineCode) : "network" };
  const totals = totalsFor([priced.line]);
  const intent = await deps.payments.createIntent({
    amount: toCents(totals.total),
    currency: CURRENCY,
    metadata: { line: lineFingerprint(input.line), locale: input.locale, name: priced.line.name },
  });
  return { ok: true, clientSecret: intent.clientSecret, intentId: intent.id, totals };
}

const walletToMethod = (wallet: string | null): PaymentMethod => (wallet === "apple_pay" ? "applepay" : "card");

/**
 * Une fois le paiement confirmé dans le navigateur : on relit l'intention chez le prestataire (jamais le client),
 * on vérifie qu'elle est payée, pour la bonne ligne et le bon montant, puis on enregistre la commande.
 */
export async function completeExpressOrder(
  input: { locale: Locale; intentId: string; line: OrderLineInput; customer: Customer; userId?: string | null },
  deps: { pricing: PricingCatalog; payments: PaymentProvider; orders: OrdersRepository },
): Promise<PlaceOrderResult> {
  const intent = await deps.payments.retrieveIntent(input.intentId);
  if (!intent || (intent.status !== "succeeded" && intent.status !== "processing")) {
    return { ok: false, errors: { cart: "payment-failed" } };
  }
  const [priced] = await deps.pricing.price([input.line], input.locale);
  if (!priced?.ok) return { ok: false, errors: { cart: priced && !priced.ok ? priced.code : "unknown-product" } };
  const expected = toCents(totalsFor([priced.line]).total);
  if (
    intent.metadata.line !== lineFingerprint(input.line) ||
    intent.amount !== expected ||
    intent.currency !== CURRENCY
  ) {
    return { ok: false, errors: { cart: "payment-failed" } };
  }
  return placeOrder(
    {
      locale: input.locale,
      customer: input.customer,
      payment: walletToMethod(intent.wallet),
      lines: [input.line],
      userId: input.userId ?? null,
      paymentRef: intent.id,
    },
    { orders: deps.orders, pricing: deps.pricing },
  );
}
