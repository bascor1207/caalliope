import type { ConnectorToDonateGateway } from '@/modules/donate/core/connector-to-donate.gateway';

import { axiosInstance } from '@/modules/app/core/axios-instance';

export class HttpDonateGateway implements ConnectorToDonateGateway {
  async createPaymentIntent(amount: number): Promise<{ clientSecret: string }> {
    const res = await axiosInstance.post('/stripe/payment-intent', {
      amount: amount * 100,
      currency: 'eur'
    });
    return {
      clientSecret: res.data.client_secret
    };
  }

  async createCheckoutSession(amount: number, email: string): Promise<string> {
    try {
      const res = await axiosInstance.post('/stripe/create-checkout-session', {
        price: amount,
        currency: 'eur',
        email: email
      });
      return res.data.url;
    } catch (error) {
      console.error('Error creating Checkout Session:', error);
      throw new Error('Failed to create checkout session.');
    }
  }
}
