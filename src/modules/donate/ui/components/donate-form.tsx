'use client';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';

import styles from './donate-form.module.scss';
import { HttpDonateGateway } from '../../infra/http-donate.gateway';

const cardElementOptions = {
    style: {
      base: {
        color: 'black',
        fontSize: '16px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': {
          color: 'black',
            },
        padding: '10px',
      },
      invalid: {
        color: '#e5424d',
        iconColor: '#e5424d',
      },
    },
  };

export const DonateForm: FC = () => {
  const [amount, setAmount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();

  console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
        const httpDonateGateway = new HttpDonateGateway();
        const paymentIntent = await httpDonateGateway.createPaymentIntent(amount);
  
        const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(paymentIntent.client_secret || '', {
            payment_method: {
            card: elements.getElement(CardElement)!,
            },
        });
  
        if (error) {
            console.error(error.message);
        } else if (confirmedPaymentIntent && confirmedPaymentIntent.status === 'succeeded') {
            setShowAlert(true);
        }
    } catch (err) {
        console.error('Error during payment process:', err);
    }
  };

  return (
      <div className={styles.container}>
        <h1 className={styles.title}>{ t('footer.donation')}</h1>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.amount}
            type='number'
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value, 10))}
            placeholder='Amount in EUR'
          />
          <div className={styles.cardContainer}>
            <CardElement options={cardElementOptions} />
          </div>
          <button className={styles.submit} type='submit' disabled={!stripe}>Donate {amount} EUR</button>
      </form>
      {showAlert && (
        <div className={styles.alert}>
          <p>{ t('thankyou') }</p>
        </div>
      )}
    </div>
  );
};