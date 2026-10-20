/** Interface publique serveur de la slice compte : repository et composant serveur. */

export { type Address, type AddressInput, addressLines, type ProfileInput, pickDefault } from "./domain/address";
export { accountRepository } from "./infrastructure/container";
export { PaymentMethods } from "./ui/payment-methods";
