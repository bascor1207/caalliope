import {
  buildOrder,
  hasErrors,
  isValidQty,
  type OrderLine,
  type ValidationErrors,
  validateCustomer,
} from "../domain/order";
import type { OrdersRepository, PlaceOrderInput, PlaceOrderResult, PricingCatalog } from "./ports";

interface Deps {
  orders: OrdersRepository;
  pricing: PricingCatalog;
  now?: () => Date;
}

/** Cas d'usage : enregistrer une précommande. Valide le client, valorise les lignes, persiste. */
export async function placeOrder(input: PlaceOrderInput, deps: Deps): Promise<PlaceOrderResult> {
  const errors: ValidationErrors = validateCustomer(input.customer);
  if (input.lines.length === 0) errors.cart = "empty-cart";
  if (input.lines.some((l) => !isValidQty(l.qty))) errors.cart = "invalid-qty";

  const lines: OrderLine[] = [];
  if (!errors.cart) {
    for (const priced of await deps.pricing.price(input.lines, input.locale)) {
      if (priced.ok) lines.push(priced.line);
      else errors.cart = priced.code;
    }
  }
  if (hasErrors(errors)) return { ok: false, errors };

  const order = {
    ...buildOrder({
      ref: await deps.orders.nextRef(),
      customer: input.customer,
      payment: input.payment,
      lines,
      now: (deps.now ?? (() => new Date()))(),
    }),
    userId: input.userId ?? null,
  };
  await deps.orders.save(order);
  return { ok: true, order };
}
