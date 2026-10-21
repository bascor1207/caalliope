import { whenDatabase } from "@koda/db";
import { catalogRepository } from "@/slices/catalog/public-server";
import type { OrdersRepository, PaymentProvider, PricingCatalog } from "../application/ports";
import { InMemoryOrdersRepository } from "./in-memory-orders.repository";
import { PostgresOrdersRepository } from "./postgres-orders.repository";
import { CatalogPricingAdapter } from "./pricing.adapter";
import { StripePaymentsAdapter, stripeConfigured } from "./stripe-payments.adapter";

/** Postgres (Supabase) dès que la base est joignable (choix à l'usage), mémoire sinon (tests, dev sans base). */
export const ordersRepository: OrdersRepository = whenDatabase(
  () => new PostgresOrdersRepository(),
  () => new InMemoryOrdersRepository(),
);
export const pricingCatalog: PricingCatalog = new CatalogPricingAdapter(catalogRepository);

let stripe: PaymentProvider | undefined;
/**
 * Stripe dès que ses clés sont présentes ; sinon l'achat express n'est simplement pas proposé.
 * Lu à l'appel : sur Cloudflare, les secrets ne sont posés dans `process.env` qu'au sein d'une requête.
 */
export const paymentProvider = (): PaymentProvider | null => {
  if (!stripeConfigured()) return null;
  stripe ??= new StripePaymentsAdapter();
  return stripe;
};
