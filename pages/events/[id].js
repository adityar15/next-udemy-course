import React, { useContext, useState, useEffect } from 'react'

import {getFirestore} from 'firebase-admin/firestore'
import admin from 'firebase-admin'
import creds from '../../fbservercreds.json'
import moment from 'moment'
//server side stripe lib
import stripe from 'stripe'

const EventImage = dynamic(()=>import(/*webpackChunkName: "eventimage"*/ '../../components/Events/EventImage'))
const EventMetaData = dynamic(()=>import(/*webpackChunkName: "eventdetails"*/ '../../components/Events/EventDetails'))
const Payment = dynamic(()=>import(/*webpackChunkName: "payment"*/ '../../components/Events/Payment'))

const EventProvider = dynamic(()=>import(/*webpackChunkName: "eventprovider"*/ '../../components/Events/EventProvider'))

import Head from 'next/head'
import dynamic from 'next/dynamic'
import { AuthContext } from '../../assets/auth'


import { useRouter } from 'next/router'
import { addNew } from '../../assets/firebaseClientHelpers'

export default function EventDetail({event, secret}) {

    const loggedInUser = useContext(AuthContext)
    const [showPayment, setShowPayment] = useState(true)

    const router = useRouter()

    async function handleSuccess(pi, uid)
    {
     
        const docRef = await addNew('orders', {
            user_id: uid,
            organiser_id: event.created_by,
            event_id: event.id,
            event_name: event.name,
            amount: event.price,
            stripe_pi: pi
        })

        router.replace(`/invoice/${docRef.id}`)
    }

    useEffect(()=>{
        if(loggedInUser.uid == event.created_by)
        setShowPayment(false)
        
        if(event.price == 0)
        {
            setShowPayment(false)
        }
    }, [loggedInUser])

    return (
        <div className='md:w-3/4 w-full rounded mx-auto my-6 shadow-lg'>
            <Head>
                <title>{event.name}</title>
                <meta content={event.description} name="description" />
                <link rel="icon" href="./logo.png" />
            </Head>

            <div>
                    <EventImage url={event.image} />
                    <EventMetaData event={event} />
                    <p className="p-5">
                        {event.description}
                    </p>

            </div>
            {showPayment && <EventProvider event={event}>
                <Payment secret={secret} onSuccess={handleSuccess} />
            </EventProvider>}
        </div>
    )
}




// export async function getStaticPaths(){
  
//     const date = moment().format("YYYY-MM-DD")
  
//     if(admin.apps.length == 0)
//     admin.initializeApp({
//         credential: admin.credential.cert(creds)
//     })
  
//     const db = getFirestore()
   
//     let paths = []
  
//     const eventsRef = db.collection('events');
//     const snapshot = await eventsRef.where('date', '>=', date).get();
//     if (snapshot.empty) {
//       console.log('No matching documents.');
//     }  
  
//     snapshot.forEach(doc => {
  
//         paths.push({params: {
//             id: doc.id
//         }})
    
//     });
   
//     return {
//       paths: paths,
//       fallback: 'blocking'
//     }
// }


export async function getServerSideProps(req)
{
    
  const date = moment().format("YYYY-MM-DD")

  const stripeInstance = stripe(process.env.Stripe_Secret_Key)
  const docId = req.params.id

  if(admin.apps.length == 0)
  admin.initializeApp({
      credential: admin.credential.cert(creds)
  })

  const db = getFirestore()

  let event = {}

  const eventsRef = db.collection('events').doc(docId);
  const doc = await eventsRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    const payload = doc.data()
    event = {
        id: doc.id,
        name: payload.name,
        date: payload.date,
        image: payload.image,
        price: payload.price,
        currency: payload.currency,
        description: payload.description,
        created_by: payload.created_by,
        is_online: payload.is_online == "true" ? true : false 
    }
  }


  const paymentIntent = await stripeInstance.paymentIntents.create(
    {
        amount: event.price * 100,
        currency: "gbp",
        automatic_payment_methods: {
          enabled: true,
        },
      }
  )


  return {
    props: {
        event: event,
        secret: paymentIntent.client_secret
    },
  }

}