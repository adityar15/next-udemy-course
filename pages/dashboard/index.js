import {useState} from 'react'
import Head from 'next/head'
import {Form, FormGroup, Button, ToastMessage} from '@adiranids/react-tailwind'
import {getFirestore} from 'firebase-admin/firestore'
import admin from 'firebase-admin'
import creds from '../../fbservercreds.json'
import '@adiranids/react-tailwind/dist/style.css'
import validate from '../../assets/validation'


import {getAuth, updateProfile} from 'firebase/auth'

import dynamic from 'next/dynamic'
import { update } from '../../assets/firebaseClientHelpers'

const FileUpload = dynamic(()=>import('../../components/FileUpload'))


const SeoHead = ()=>{
    return(
        <Head>
            <title>Dashboard | Profile</title>
        </Head>
    )
}

export default function Dashboard({user, uid}) {

    const [name, setName] = useState(user.name)
    const [address, setAddress] = useState(user.address || '')
    const [phone, setPhone] = useState(user.phone || '')

    const [nError, setNameError] = useState("")
    const [aError, setAddressError] = useState("")
    const [pError, setPhoneError] = useState("")
    const [fError, setFileError] = useState("")

    const nValidate = new validate(name, "Name")
    const aValidate = new validate(address, "Address")
    const pValidate = new validate(phone, "Phone")

    const [success, setSuccess] = useState("")
  
    const [startUpload, setStartUpload] = useState(false)



    function setErrors(nameError, addressError, phoneError)
    {
        setNameError(nameError)
        setAddressError(addressError)
        setPhoneError(phoneError)
        setSuccess("")
    }


    const updateRecord = async (e)=>{
        e.preventDefault()
        const {error:nerror} = nValidate.required().isString().lenValidator(3,20) 
        const {error:aerror} = aValidate.nullable().isString().lenValidator(3,70)
        const {error:perror} = pValidate.nullable().isPhone().lenValidator(3,14)
        
        if(nerror || aerror || perror)
        {
            setErrors(nerror, aerror, perror)
            return false
        }


        await update('users', uid, {
            name: name,
            address: address,
            phone: phone
         })

        setErrors(nerror, aerror, perror)
        setStartUpload(true)
        setSuccess("Profile updated successfully!")
      
    }

    async function handleUpload(url)
    {
        const auth = getAuth()
        console.log("user", auth.currentUser)
        await updateProfile(auth.currentUser, { photoURL: url})

        
        await update('users', uid, {
            profile_url: url
          })

        setSuccess("Profile Image updated")
        setFileError("")
    }

    function handleError(error){
        setSuccess("")
        setFileError(error)
    }


    return (
        <div>
            <SeoHead />
            <Form onSubmit={updateRecord}>
                 <FormGroup type="text" value={name} change={setName} label="Name" error={nError} />   
                 <FormGroup type="text" value={address} change={setAddress} label="Address" error={aError} />   
                 <FormGroup type="text" value={phone} change={setPhone} label="Phone" error={pError} />   
                  
                 <FileUpload label="Profile Image" startUpload={startUpload} onUpload={handleUpload} onError={handleError}
                 fileName={`users/${uid}`} />
                 {fError && <ToastMessage type="error">{fError}</ToastMessage>}
                 <div>
                     <Button buttonType="success">Update</Button>
                 </div>
                
                {success &&  <ToastMessage type="success"> {success} </ToastMessage>}
            </Form>
        </div>
    )
}


export async function getServerSideProps({req}){
     
    if(admin.apps.length == 0)
    admin.initializeApp({
        credential: admin.credential.cert(creds)
    })

    let user = {}

    const userRef = getFirestore().collection('users').doc(req.cookies.uid);
      const doc = await userRef.get();
      if (doc.exists) {
        user = doc.data()
      } 

    return{
        props:{
            user: user,
            uid: req.cookies.uid
        }
    }
}

Dashboard.layout = "AuthLayout"
Dashboard.title = "Profile"
