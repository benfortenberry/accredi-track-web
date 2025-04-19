import {CheckoutProvider} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51RD50eQh69piZlJOcqpJwmzVmSQFWR3VC5U0vEenBdHhLBgDB79CZ1C3TmzKUSUFyN2kegK87kZozqt5pFGP3rMB009XP8CxBU');

export default function Stripe() {
  const fetchClientSecret = () => {
    return fetch('/create-checkout-session', {method: 'POST'})
      .then((response) => response.json())
      .then((json) => json.checkoutSessionClientSecret)
  };

  return (
    <CheckoutProvider stripe={stripePromise} options={{fetchClientSecret}}>
      <CheckoutForm />
    </CheckoutProvider>
  );
};