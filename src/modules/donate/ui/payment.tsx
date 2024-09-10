import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { DonateForm } from './components/donate-form';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', {
  apiVersion: '2024-06-20'
});

const PaymentPage: React.FC = () => (
    <Elements stripe={stripePromise}>
      <DonateForm />
    </Elements>
  );
  
  export default PaymentPage;