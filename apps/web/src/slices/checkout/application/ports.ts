import type { Locale } from "@/shared/kernel/locale";
import type {
  Customer,
  ErrorCode,
  Order,
  OrderLine,
  OrderLineInput,
  OrderSummary,
  PaymentMethod,
  ValidationErrors,
} from "../domain/order";

export interface OrdersRepository {
  nextRef(): Promise<string>;
  save(order: Order): Promise<void>;
  findByRef(ref: string): Promise<Order | null>;
  /** Historique d'un client (compte rattaché ou même e-mail), du plus récent au plus ancien. */
  listForUser(userId: string, email: string): Promise<OrderSummary[]>;
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
  /** Renseigné côté serveur depuis la session, jamais par le client. */
  userId?: string | null;
  paymentRef?: string | null;
}

/** Paiement créé chez le prestataire, à confirmer dans le navigateur. */
export interface PaymentIntentRef {
  id: string;
  clientSecret: string;
}

export interface PaymentIntentState {
  id: string;
  status: "succeeded" | "processing" | "requires_payment_method" | "requires_action" | "canceled" | "other";
  /** Montant en centimes. */
  amount: number;
  currency: string;
  metadata: Record<string, string>;
  /** Portefeuille utilisé, s'il y en a un (apple_pay, google_pay, link…). */
  wallet: string | null;
}

/** Port paiement (Stripe…) : créer puis relire une intention de paiement. Montants en centimes. */
export interface PaymentProvider {
  createIntent(input: {
    amount: number;
    currency: string;
    metadata: Record<string, string>;
  }): Promise<PaymentIntentRef>;
  retrieveIntent(id: string): Promise<PaymentIntentState | null>;
}

export type PlaceOrderResult = { ok: true; order: Order } | { ok: false; errors: ValidationErrors };

/** Port client : comment le navigateur soumet une commande (Server Action, HTTP...). */
export interface PlaceOrderGateway {
  place(input: PlaceOrderInput): Promise<PlaceOrderResult>;
}
