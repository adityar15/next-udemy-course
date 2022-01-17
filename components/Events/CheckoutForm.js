import React, { useContext, useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

import {Button, ToastMessage} from '@adiranids/react-tailwind'
import '@adiranids/react-tailwind/dist/style.css'
import { EventContext } from "./EventProvider";
import { useRouter } from "next/router";
import {AuthContext} from '../../assets/auth'

export default function CheckoutForm({onSuccess}) {
  const stripe = useStripe();
  const elements = useElements();

  const loggedInUser = useContext(AuthContext)

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("error")

  const [returnURL, setReturnURL] = useState("")

  const event = useContext(EventContext)

  const router = useRouter()

 const [clientSecret, setSecret] = useState("")
 const [uid, setUID] = useState("")

  useEffect(()=>{
    console.log("url", `${process.env.NEXT_PUBLIC_URL}/events/${event.id}/?uid=${loggedInUser.uid}`)
    setReturnURL(`${process.env.NEXT_PUBLIC_URL}/events/${event.id}/?uid=${loggedInUser.uid}`)
  }, [event, loggedInUser])


  useEffect(()=>{
    setSecret(router.query.payment_intent_client_secret)
    setUID(router.query.uid)
  }, [])

  useEffect(() => {
    if (!stripe || !clientSecret || !uid) {
      return;
    }


    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          setMessageType("success")
          onSuccess(paymentIntent.id, uid)
          break;
        case "processing":
          setMessage("Your payment is processing.");
          setMessageType("success")
          break;
        case "requires_payment_method":
          setMessage("You need to put your card details");
          setMessageType("error")
          break;
        default:
          setMessage("Something went wrong.");
          setMessageType("error")
          break;
      }
    });
  }, [stripe]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true); 

   

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: returnURL,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
  
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="my-4 w-48 hover:w-52 duration-200 transition-all" buttonType="dark">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && <ToastMessage type={messageType} id="payment-message">{message}</ToastMessage>}
    </form>
  );
}