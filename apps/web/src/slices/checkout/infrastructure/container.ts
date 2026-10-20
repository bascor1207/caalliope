import { hasDatabase } from "@koda/db";
import { catalogRepository } from "@/slices/catalog/public-server";
import type { OrdersRepository, PricingCatalog } from "../application/ports";
import { InMemoryOrdersRepository } from "./in-memory-orders.repository";
import { PostgresOrdersRepository } from "./postgres-orders.repository";
import { CatalogPricingAdapter } from "./pricing.adapter";

/** Postgres (Supabase) dès que la base est configurée, mémoire sinon (tests, dev sans base). */
export const ordersRepository: OrdersRepository = hasDatabase()
  ? new PostgresOrdersRepository()
  : new InMemoryOrdersRepository();
export const pricingCatalog: PricingCatalog = new CatalogPricingAdapter(catalogRepository);
