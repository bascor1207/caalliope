'use client';
import { Card } from '@nextui-org/react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';

import { HttpDonateGateway } from '../../infra/http-donate.gateway';

export const DonateForm: FC = () => {
  const [amount, setAmount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const httpDonateGateway = new HttpDonateGateway();

  console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) {
      return
    }

    try {
      const url = await httpDonateGateway.createCheckoutSession(amount, email)

      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className='bg-white shadow-md rounded-lg p-6 mx-auto max-w-lg'>
      <h1 className='text-center text-2xl font-bold mb-6'>{t('footer.donation')}</h1>
      <form onSubmit={handleSubmit}>
        <input
          className='w-full p-3 border border-gray-300 rounded-lg mb-4'
          type='number'
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          placeholder='Amount in EUR'
        />
        <input
          className='w-full p-3 border border-gray-300 rounded-lg mb-4'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className={`w-full p-3 rounded-lg text-white transition-colors duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'}`}
          type='submit'
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : `Donate ${amount} EUR`}
        </button>
      </form>
      {showAlert && (
        <div className='mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg text-center'>
          <p>{t('thankyou')}</p>
        </div>
      )}
    </Card>
  );
};