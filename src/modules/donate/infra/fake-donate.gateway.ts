import type { ConnectorToDonateGateway } from '@/modules/donate/core/connector-to-donate.gateway';
import type Stripe from 'stripe';

export class FakeDonateGateway implements ConnectorToDonateGateway {
    returnedResponse!: Stripe.PaymentIntent;

    createPaymentIntent(amount: number): Promise<{ clientSecret: string }> {
        return new Promise((resolve, reject) => {
            if (!amount) return reject();
            return resolve({ clientSecret: 'ok' });
        });
    }

    createCheckoutSession(): Promise<string> {
        return new Promise((resolve) => {
            resolve('ok');
        });
    }
}