import type Stripe from 'stripe';

import { axiosInstance } from '@/modules/app/core/axios-instance';

export class HttpDonateGateway {
    async createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
        const res = await axiosInstance.post('/stripe/payment-intent', {
            amount: amount * 100, // Convertir l'amount en centimes
        });
        return res.data;
    }
}