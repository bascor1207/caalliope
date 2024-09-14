import type { ConnectorToDonateGateway } from '@/modules/donate/core/connector-to-donate.gateway';
import type Stripe from 'stripe';

export class FakeDonateGateway implements ConnectorToDonateGateway {
    returnedResponse!: Stripe.PaymentIntent;

    createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
        return new Promise((resolve, reject) => {
            if (!amount) return reject();
            return resolve(this.returnedResponse);
        });
    }

    createCheckoutSession(): Promise<Stripe.Checkout.Session> {
        return new Promise((resolve) => {
            resolve({} as Stripe.Checkout.Session);
        });
    }
}