import React, {useState, useEffect, useContext} from 'react'
import {Form, FormGroup, Button, Title} from '@adiranids/react-tailwind'
import '@adiranids/react-tailwind/dist/style.css'

import Head from 'next/head'

// import {required, lenValidator, isEmail} from '../assets/validation'
import validate from '../assets/validation'
import initiateFirebaseApp from '../assets/firebaseApp' 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {AuthContext} from '../assets/auth'
import { useRouter } from 'next/router'
export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorEmail, setErrorEmail]=useState("")
    const [errorPassword, setErrorPassword]=useState("")
    const loggedInUser = useContext(AuthContext)

    const router = useRouter()

    useEffect(()=>{
        if(loggedInUser)
        router.replace('/')
    },[loggedInUser])
  
    function handleLogin(e){
        e.preventDefault()
        const eValidate = new validate(email)
        const pValidate = new validate(password, "Password")
        
        let {error:eError} = eValidate.required()
        let {error:pError} = pValidate.required().lenValidator(6,16)

        const auth = getAuth()

        if(eError || pError)
        {
            setErrors(eError, pError)
            return false
        }

        
        signInWithEmailAndPassword(auth, email, password).then(user => {
           
        }).catch(err=> {

            if(err.code == "auth/user-not-found")
            setErrorEmail("You need to register first")
            else if(err.code == "auth/wrong-password")
            alert("Incorrect credentials")
        })

      
    }

    function setErrors(emailError, passwordError)
    {
        setErrorEmail(emailError)
        setErrorPassword(passwordError)
    }

    return (
        <div className="grid place-items-center mt-32">
        <Head>
            <title>Login</title>
            <meta name="description" content="Login page for tech events" />
        </Head>
        <Title className="text-center font-bold" size="h1">Login</Title>
        <Form className="md:w-1/2 lg:w-1/4 w-full" onSubmit={handleLogin}>

            <FormGroup type="email" label="Email" value={email} change={(val)=>setEmail(val)} error={errorEmail}/>
            <FormGroup type="password" label="Password" value={password} change={(val)=>setPassword(val)} error={errorPassword}/>
            <div>
                <Button className="float-right" buttonType="primary">Login</Button>
            </div>

        </Form>
        </div>
    )
}

