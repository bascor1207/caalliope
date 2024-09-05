import Stripe from 'stripe';

import type { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', {
  apiVersion: '2024-06-20'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount, 
        currency: 'eur', 
        payment_method_types: ['card'], 
      });

      res.status(200).json({ client_secret: paymentIntent.client_secret });
    } catch (err) {
      const errorMessage = (err as Error).message;
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}