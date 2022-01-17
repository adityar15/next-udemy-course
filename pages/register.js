import React, {useState, useContext, useEffect} from 'react'
import {Form, FormGroup, Button, Title} from '@adiranids/react-tailwind'
import '@adiranids/react-tailwind/dist/style.css'
import {useRouter} from 'next/router'
import Head from 'next/head'

import validate from '../assets/validation'


import {AuthContext} from '../assets/auth'

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import {setDoc, doc, getFirestore} from 'firebase/firestore'
import { addNewWithDocId } from '../assets/firebaseClientHelpers'

export default function Register() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const [errorEmail, setErrorEmail]=useState("")
    const [errorPassword, setErrorPassword]=useState("")
    const [errorName, setErrorName]=useState("")


    const loggedInUser = useContext(AuthContext)

    const router = useRouter()

    useEffect(()=>{
        if(loggedInUser)
        router.replace('/')
    },[loggedInUser])


    function handleRegistration(e){
        e.preventDefault()
        const eValidate = new validate(email)
        const pValidate = new validate(password, "Password")
        const nValidate = new validate(name, "Name")
       
        

        let {error:eError} = eValidate.required()
        let {error:pError} = pValidate.required().lenValidator(6,16)

        let {error:nError} = nValidate.lenValidator(3,20).required()
        const auth = getAuth()

        if(eError || pError || nError)
        {
            setErrors(eError, pError, nError)
            return false
        }

        
        createUserWithEmailAndPassword(auth, email, password).then( async(user) => {
          
            const docRef = await addNewWithDocId('users',user.user.uid, {name:name})
            
        }).catch(err=> {
            console.log(err.code)
            if(err.code == "auth/email-already-in-use")
            setErrorEmail("You have already registered")
        })

        // if(!errorEmail && !errorPassword)
        // alert("all good")
    }

    function setErrors(emailError, passwordError, nameError)
    {
        setErrorEmail(emailError)
        setErrorPassword(passwordError)
        setErrorName(nameError)
    }

    return (
        <div className="grid place-items-center mt-32">
        <Head>
            <title>Register</title>
            <meta name="description" content="Register page for tech events" />
        </Head>
        <Title className="text-center font-bold" size="h1">Register</Title>
        <Form className="md:w-1/2 lg:w-1/4 w-full" onSubmit={handleRegistration}>

        <FormGroup type="text" label="Name" value={name} change={(val)=>setName(val)} error={errorName}/>
            <FormGroup type="email" label="Email" value={email} change={(val)=>setEmail(val)} error={errorEmail}/>
            <FormGroup type="password" label="Password" value={password} change={(val)=>setPassword(val)} error={errorPassword}/>
            <div>
                <Button className="float-right" buttonType="primary">Register</Button>
            </div>

        </Form>
        </div>
    )
}
