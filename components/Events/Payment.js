
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import dynamic from 'next/dynamic';

const CheckoutForm = dynamic(()=>import(/*webpackChunkName: "checkoutform"*/ './CheckoutForm'))

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_Stripe_Public_Key);

export default function Payment({secret, onSuccess}) {
   
    const appearance = {
            theme: "flat"
        }
    
    const options = {
        clientSecret:secret,
        appearance
      };
    return (
        <div className="p-5">
           
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm onSuccess={onSuccess} />
        </Elements>
      
        </div>
    )
}
