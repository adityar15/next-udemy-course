import { useState } from "react";
import Head from "next/head";
import {
  Form,
  FormGroup,
  Button,
  ToastMessage,
} from "@adiranids/react-tailwind";
import "@adiranids/react-tailwind/dist/style.css";
import validate from "../../assets/validation";

import { collection, addDoc, getFirestore, doc, updateDoc } from "firebase/firestore";
import dynamic from "next/dynamic";


const SeoHead = () => {
  return (
    <Head>
      <title>Dashboard | Create Event</title>
    </Head>
  );
};

const Selector = dynamic(() => import("../../components/Selector"));
const TextBox = dynamic(() => import("../../components/TextBox"));
const FileUpload = dynamic(() => import("../../components/FileUpload"));


export default function CreateEvent({ uid }) {
  const [name, setName] = useState("");
  const [isOnline, setIsOnline] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [currency, setCurrency] = useState("");
  const [price, setPrice] = useState(0);


  const [startUpload, setStartUpload] = useState(false)
  const [eventID, setEventID] = useState("")

  const [nError, setNameError] = useState("");
  const [dError, setDescError] = useState("");
  const [cError, setCurrencyError] = useState("");
  const [pError, setPriceError] = useState("");

  const nValidate = new validate(name, "Name");
  const dValidate = new validate(description, "Description");
  const cValidate = new validate(currency, "Currency");
  const pValidate = new validate(price, "Price");

  const [success, setSuccess] = useState("");

  const currencyOptions = [
    { label: "USD", value: "usd" },
    { label: "GBP", value: "gbp" },
  ];

  const db = getFirestore();

  function setErrors(nameError, descError, currencyError, priceError) {
    setNameError(nameError);
    setPriceError(priceError);
    setDescError(descError);
    setCurrencyError(currencyError);
    setSuccess("");
  }

  const createEvent = async (e) => {
    e.preventDefault();
    const { error: nerror } = nValidate
      .required()
      .isString()
      .lenValidator(3, 100);
    const { error: derror } = dValidate
      .required()
      .isString()
      .lenValidator(3, 5000);
    const { error: cerror } = cValidate
      .required()
      .isString()
      .lenValidator(3, 4);
    const { error: perror } = pValidate.required().isNumber();
    if (nerror || derror || perror || cerror) {
      setErrors(nerror, cerror, perror, derror);
      return false;
    }

    setErrors(nerror, cerror, perror, derror);

    //creating event
   

    const eventRef = await addDoc(collection(db, "events"), {
      created_by: uid,
      name: name,
      date: date,
      price: price,
      currency: currency,
      created_at: new Date(),
      description: description,
      is_online: isOnline,
    });

    //upload file
    setEventID(eventRef.id)
    setStartUpload(true)
   
    setSuccess("Event created successfully!");
  };

  async function handleOnUpload(url)
  { 
    const docRef = doc(db, 'events', eventID)
    await updateDoc(docRef, {
       image: url
    });
  }

  return (
    <div>
      <SeoHead />
      <Form onSubmit={createEvent}>
        <FormGroup
          type="text"
          value={name}
          change={setName}
          label="Name"
          error={nError}
        />
        <Selector
          label="Currency"
          options={currencyOptions}
          change={setCurrency}
          error={cError}
          value={currency}
        />
        <FormGroup
          type="number"
          value={price}
          change={setPrice}
          label="Price"
          error={pError}
        />
        <FormGroup
          type="date"
          value={date}
          change={setDate}
          label="Event Date"
          error=""
        />
        <Selector
          label="Is the event online?"
          options={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          change={setIsOnline}
          error=""
          value={isOnline}
        />
        <TextBox
          change={setDescription}
          value={description}
          label="Description"
          error={dError}
        />
        <FileUpload label="Cover photo for you event" fileName={`events/${eventID}`} startUpload={startUpload} onUpload={handleOnUpload} />
   
        <div>
          <Button buttonType="success">Create</Button>
        </div>
        {success && <ToastMessage type="success"> {success} </ToastMessage>}
      </Form>
    </div>
  );
}

CreateEvent.layout = "AuthLayout";
CreateEvent.title = "Create Event";

export async function getServerSideProps({ req }) {
  return {
    props: {
      uid: req.cookies.uid,
    },
  };
}
