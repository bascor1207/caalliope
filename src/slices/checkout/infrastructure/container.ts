import { catalogRepository } from "@/slices/catalog/public-server";
import type { OrdersRepository, PricingCatalog } from "../application/ports";
import { InMemoryOrdersRepository } from "./in-memory-orders.repository";
import { CatalogPricingAdapter } from "./pricing.adapter";

export const ordersRepository: OrdersRepository = new InMemoryOrdersRepository();
export const pricingCatalog: PricingCatalog = new CatalogPricingAdapter(catalogRepository);
