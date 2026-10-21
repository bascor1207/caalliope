"use server";

import { isLocale } from "@/shared/kernel/locale";
import { getSessionUser } from "@/slices/auth/public-server";
import { completeExpressOrder, type PrepareResult, prepareExpressPayment } from "../application/express-checkout";
import type { PlaceOrderResult } from "../application/ports";
import type { Customer, OrderLineInput } from "../domain/order";
import { ordersRepository, paymentProvider, pricingCatalog } from "./container";

const cleanLine = (l: Partial<OrderLineInput> | undefined): OrderLineInput => ({
  productId: String(l?.productId ?? "").slice(0, 80),
  colorKey: String(l?.colorKey ?? "").slice(0, 80),
  size: String(l?.size ?? "").slice(0, 20),
  qty: Number(l?.qty ?? 1),
});

/** Étape 1 (au clic sur Apple Pay / Google Pay) : intention de paiement valorisée côté serveur. */
export async function prepareExpressPaymentAction(input: {
  locale: string;
  line: OrderLineInput;
}): Promise<PrepareResult> {
  const payments = paymentProvider();
  if (!isLocale(input.locale) || !payments) return { ok: false, code: "network" };
  try {
    return await prepareExpressPayment(
      { locale: input.locale, line: cleanLine(input.line) },
      { pricing: pricingCatalog, payments },
    );
  } catch {
    return { ok: false, code: "network" };
  }
}

/** Étape 2 (paiement confirmé) : vérification chez Stripe puis enregistrement de la commande. */
export async function completeExpressOrderAction(input: {
  locale: string;
  intentId: string;
  line: OrderLineInput;
  customer: Customer;
}): Promise<PlaceOrderResult> {
  const payments = paymentProvider();
  if (!isLocale(input.locale) || !payments) return { ok: false, errors: { cart: "network" } };
  const user = await getSessionUser().catch(() => null);
  const customer = Object.fromEntries(
    (["email", "firstName", "lastName", "address", "zip", "city"] as const).map((k) => [
      k,
      String(input.customer?.[k] ?? "")
        .trim()
        .slice(0, 200),
    ]),
  ) as unknown as Customer;
  try {
    return await completeExpressOrder(
      {
        locale: input.locale,
        intentId: String(input.intentId ?? "").slice(0, 120),
        line: cleanLine(input.line),
        customer,
        userId: user?.id ?? null,
      },
      { pricing: pricingCatalog, payments, orders: ordersRepository },
    );
  } catch {
    return { ok: false, errors: { cart: "network" } };
  }
}
