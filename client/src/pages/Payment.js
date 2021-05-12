import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import StripeCheckout from '../components/StripeCheckout'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = () => {
  return (
    <div className="container text-center p-5">
        <h4>Complete Your Purchase</h4>
        <Elements stripe={stripePromise}>
            <div className="col-md-8 offset-md-2">
                <StripeCheckout />
            </div>
        </Elements>
    </div>
  );
};

export default Payment