import React, { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card } from 'antd';
import { DollarOutlined, CheckOutlined } from '@ant-design/icons'
import {createPaymentIntent} from '../functions/stripe';
import '../stripe.css'

export default function StripeCheckout() {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  const { user, coupon } = useSelector(state => ({...state}))

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    createPaymentIntent(user.token, coupon)
      .then(res => {
          console.log(res.data)
        setClientSecret(res.data.clientSecret);
        setCartTotal(res.data.cartTotal);
        setTotalAfterDiscount(res.data.totalAfterDiscount);
        setPayable(res.data.payable);
      }).catch(err => console.log(err));
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };


  const handleSubmit = async ev => {
      ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_detail: {
            name: ev.target.name.value
        }
      }
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
        console.log('payment successed => ', JSON.stringify(payload, null, 4))
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
      <>
        <div className="text-center pb-5">
          <Card 
            cover={<img src="https://eg.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/415302/1.jpg?4345" style={{height: '200px', objectFit: 'cover', marginBottom: '-50px'}} />}
            actions={[
                <>
                  <DollarOutlined key="dollar"  className="text-info"/> <br /> Total: ${cartTotal} 
                </>,
                <>
                  <CheckOutlined key="dollar"  className="text-info"/> <br /> Total Payable: ${(payable / 100).toFixed(2)} 
                </>
            ]}
          />
        </div>
        <form id="payment-form" className="stripe-form m-auto" onSubmit={handleSubmit}>
        <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
        <button
            disabled={processing || disabled || succeeded}
            id="submit"
        >
            <span id="button-text">
            {processing ? (
                <div className="spinner" id="spinner"></div>
            ) : (
                "Pay"
            )}
            </span>
        </button>
        {/* Show any error that happens when processing the payment */}
        {error && (
            <div className="card-error" role="alert">
            {error}
            </div>
        )}
        <p className={succeeded ? "result-message" : "result-message hidden"}>
        Payment succeeded, <Link to='/user/history'>See your Purchase History.</Link>
        </p>
        </form>
    </>
  );
}