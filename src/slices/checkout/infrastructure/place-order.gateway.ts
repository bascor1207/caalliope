import type { PlaceOrderGateway } from "../application/ports";
import { placeOrderAction } from "./place-order.action";

/** Adapter client : la gateway appelle la Server Action. Remplaçable par Stripe Checkout. */
export const placeOrderGateway: PlaceOrderGateway = {
  place: (input) => placeOrderAction(input),
};
