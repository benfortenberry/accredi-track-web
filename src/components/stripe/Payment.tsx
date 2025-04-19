import getStripe from "../../lib/stripe.tsx";
import { useAuth0 } from "@auth0/auth0-react";

const Payment = () => {

    const { user } = useAuth0();

  async function handleCheckout() {
  
    const userEmail = user?.email;
    console.log(userEmail);

    const stripe = await getStripe();
    await stripe?.redirectToCheckout({
      lineItems: [
        {
          price: import.meta.env.VITE_STRIPE_PRODUCT_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      successUrl: import.meta.env.VITE_STRIPE_SUCCESS_URL,
      cancelUrl: import.meta.env.VITE_STRIPE_CANCEL_URL,
      customerEmail: userEmail,
    });
  }

  return <button onClick={handleCheckout}>Checkout</button>;
};

export default Payment;
