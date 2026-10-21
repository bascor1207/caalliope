import Stripe from "stripe";
import type { PaymentIntentRef, PaymentIntentState, PaymentProvider } from "../application/ports";

/** Clés Stripe : `STRIPE_SECRET_KEY` côté serveur, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` pour le navigateur. */
export const stripeConfigured = () =>
  Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export const stripePublishableKey = () => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

let client: Stripe | null = null;
const stripe = () => {
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { typescript: true });
  return client;
};

const STATUSES: PaymentIntentState["status"][] = [
  "succeeded",
  "processing",
  "requires_payment_method",
  "requires_action",
  "canceled",
];

/** Adapter Stripe du port paiement : PaymentIntents, méthodes automatiques (Apple Pay, Google Pay, Link, CB). */
export class StripePaymentsAdapter implements PaymentProvider {
  async createIntent(input: {
    amount: number;
    currency: string;
    metadata: Record<string, string>;
  }): Promise<PaymentIntentRef> {
    const intent = await stripe().paymentIntents.create({
      amount: input.amount,
      currency: input.currency,
      metadata: input.metadata,
      automatic_payment_methods: { enabled: true },
      description: input.metadata.name ? `KODA · ${input.metadata.name}` : "KODA",
    });
    if (!intent.client_secret) throw new Error("stripe: client_secret absent");
    return { id: intent.id, clientSecret: intent.client_secret };
  }

  async retrieveIntent(id: string): Promise<PaymentIntentState | null> {
    const intent = await stripe()
      .paymentIntents.retrieve(id, { expand: ["latest_charge"] })
      .catch(() => null);
    if (!intent) return null;
    const charge = typeof intent.latest_charge === "object" ? intent.latest_charge : null;
    const wallet = charge?.payment_method_details?.card?.wallet?.type ?? null;
    return {
      id: intent.id,
      status: (STATUSES as string[]).includes(intent.status)
        ? (intent.status as PaymentIntentState["status"])
        : "other",
      amount: intent.amount,
      currency: intent.currency,
      metadata: intent.metadata ?? {},
      wallet,
    };
  }
}
