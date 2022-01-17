import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { Title } from "@adiranids/react-tailwind";
import "@adiranids/react-tailwind/dist/style.css";
import { useRouter } from "next/router";
import { AuthContext } from "../../assets/auth";
import { getSingleDoc } from "../../assets/firebaseClientHelpers";
import dynamic from "next/dynamic";

const EventMeta = dynamic(() =>
  import(
    /*webpackChunkName:"eventdetail"*/ "../../components/Events/EventDetails"
  )
);
const EventImage = dynamic(() =>
  import(
    /*webpackChunkName:"eventdetail"*/ "../../components/Events/EventImage"
  )
);
const Avatar = dynamic(() =>
  import(/*webpackChunkName:"avatar"*/ "../../components/Avatar")
);

export default function Invoice() {
  const router = useRouter();
  const loggedInUser = useContext(AuthContext);

  const [order, setOrder] = useState({});
  const [event, setEvent] = useState({});
  const [organiser, setOrganiser] = useState(null);

  async function getRecords() {
    const orderDetails = await getSingleDoc("orders", router.query.invoice);
    setOrder(orderDetails);

    const eventDetails = await getSingleDoc("events", orderDetails.event_id);
    setEvent(eventDetails);

    const organiserDetails = await getSingleDoc(
      "users",
      orderDetails.organiser_id
    );
    setOrganiser(organiserDetails);

    console.log("orders", orderDetails);
    console.log("events", eventDetails);
  }

  useEffect(() => {
    if (router.query.invoice) getRecords();
  }, [router]);

  return (
    <div>
      <Head>
        <title>Invoice</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="p-5">
        <Title size="h1">You are attending {event.name}</Title>

        <div className="md:w-3/4 w-full mx-auto mt-5 shadow-lg rounded-md p-3 space-y-4">
          {Object.keys(event).length > 0 && (
            <div>
              <EventImage url={event.image} />
              <EventMeta event={event} />
            </div>
          )}

          {organiser && (
            <div>
              <Title size="h3">Organised by</Title>
              <div className="flex items-center space-x-3 space-y-1">
                <Avatar url={organiser.profile_url} /> <p>{organiser.name}</p>
              </div>
            </div>
          )}

          <p>{event.description}</p>
        </div>
      </div>
    </div>
  );
}
