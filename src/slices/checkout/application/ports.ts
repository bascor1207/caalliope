import type { Locale } from "@/shared/kernel/locale";
import type {
  Customer,
  ErrorCode,
  Order,
  OrderLine,
  OrderLineInput,
  PaymentMethod,
  ValidationErrors,
} from "../domain/order";

export interface OrdersRepository {
  nextRef(): Promise<string>;
  save(order: Order): Promise<void>;
  findByRef(ref: string): Promise<Order | null>;
}

export type PricedLine = { ok: true; line: OrderLine } | { ok: false; code: ErrorCode };

/**
 * Anti-corruption layer vers le catalogue : le checkout ne lit jamais les prix du client,
 * il demande à ce port de valoriser et valider chaque ligne.
 */
export interface PricingCatalog {
  price(lines: OrderLineInput[], locale: Locale): Promise<PricedLine[]>;
}

export interface PlaceOrderInput {
  locale: Locale;
  customer: Customer;
  payment: PaymentMethod;
  lines: OrderLineInput[];
}

export type PlaceOrderResult = { ok: true; order: Order } | { ok: false; errors: ValidationErrors };

/** Port client : comment le navigateur soumet une commande (Server Action, HTTP...). */
export interface PlaceOrderGateway {
  place(input: PlaceOrderInput): Promise<PlaceOrderResult>;
}
