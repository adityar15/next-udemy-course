import "../styles/globals.css";
import GuestLayout from "../layouts/GuestLayout";
import AuthLayout from "../layouts/AuthLayout";
import initiateFirebaseApp from "../assets/firebaseApp";
import {useEffect, useState} from 'react'
import { onAuthStateChanged, getAuth } from "firebase/auth";

import {AuthContext} from '../assets/auth'
import nookies from 'nookies'
import Head from 'next/head'
function MyApp({ Component, pageProps }) {
  
  initiateFirebaseApp();

  const [user,setUser] = useState("")

  useEffect(()=>{
    onAuthStateChanged(getAuth(), (loggedInUser)=>{
      if(loggedInUser)
      {
        loggedInUser.getIdToken().then(token => nookies.set(undefined, "token", token, {}))
       
        setUser(loggedInUser)
      }
    })
  },[])
 
  const layoutList = {
    "AuthLayout":AuthLayout,
    "GuestLayout": GuestLayout
  }

  const Layout = Component.layout ? layoutList[Component.layout] : GuestLayout
  const title = Component.title || ""
  return (
    <AuthContext.Provider value={user}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </Head>
      <Layout title={title}>
        <Component {...pageProps} />
      </Layout>
    </AuthContext.Provider>
  );
}

export default MyApp;
