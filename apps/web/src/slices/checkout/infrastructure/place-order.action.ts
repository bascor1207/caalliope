"use server";

import { isLocale } from "@/shared/kernel/locale";
import { placeOrder } from "../application/place-order";
import type { PlaceOrderInput, PlaceOrderResult } from "../application/ports";
import { PAYMENT_METHODS } from "../domain/order";
import { ordersRepository, pricingCatalog } from "./container";

/** Server Action : unique porte d'entrée réseau du checkout. Re-valide tout côté serveur. */
export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (!isLocale(input.locale) || !PAYMENT_METHODS.includes(input.payment)) {
    return { ok: false, errors: { cart: "network" } };
  }
  const safeInput: PlaceOrderInput = {
    locale: input.locale,
    payment: input.payment,
    customer: Object.fromEntries(
      (["email", "firstName", "lastName", "address", "zip", "city"] as const).map((k) => [
        k,
        String(input.customer?.[k] ?? "")
          .trim()
          .slice(0, 200),
      ]),
    ) as unknown as PlaceOrderInput["customer"],
    lines: (Array.isArray(input.lines) ? input.lines : []).slice(0, 20).map((l) => ({
      productId: String(l.productId),
      colorKey: String(l.colorKey),
      size: String(l.size),
      qty: Number(l.qty),
    })),
  };
  return placeOrder(safeInput, { orders: ordersRepository, pricing: pricingCatalog });
}
