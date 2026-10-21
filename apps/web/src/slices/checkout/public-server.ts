/** Interface publique serveur de la slice checkout : historique de commandes pour l'espace client. */
export type { OrderStatus, OrderSummary } from "./domain/order";
export { ordersRepository } from "./infrastructure/container";
export { stripeConfigured, stripePublishableKey } from "./infrastructure/stripe-payments.adapter";
