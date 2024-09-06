import type Stripe from 'stripe';

export interface ConnectorToDonateGateway {
    createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent>;
}
