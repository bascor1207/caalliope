/** Interface publique store de la slice checkout. */
export { type CheckoutState, checkoutReducer, registerCheckoutListeners } from "./application/checkout.slice";
export type { PlaceOrderGateway, PlaceOrderInput, PlaceOrderResult } from "./application/ports";
export { placeOrderGateway } from "./infrastructure/place-order.gateway";
