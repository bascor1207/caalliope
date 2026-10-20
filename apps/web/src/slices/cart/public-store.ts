/** Interface publique store de la slice panier : reducer, listeners, pont bus, sélecteurs. */
export { bindCartToBus } from "./application/cart.bus";
export { registerCartListeners } from "./application/cart.listeners";
export {
  type CartState,
  cartReducer,
  type LastAdded,
  selectCartCount,
  selectCartTotals,
  selectLines,
} from "./application/cart.slice";
