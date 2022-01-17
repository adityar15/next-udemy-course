import {useState, useEffect} from 'react'
import dynamic from 'next/dynamic'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
const Label = dynamic(() => import("./Label"));
const CustomFormGroup = dynamic(() => import("./CustomFormGroup"));

const ProgressBar = dynamic(() => import("./ProgressBar"));

export default function FileUpload({label, startUpload, onUpload, fileName, onError=()=>{}}) {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0)

    useEffect(()=>{
        if(startUpload == true && file)
        {
            const storage = getStorage();
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress)
              
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused');
                    break;
                  case 'running':
                    console.log('Upload is running');
                    break;
                }
              }, 
              (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                  case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                  case 'storage/canceled':
                    // User canceled the upload
                    break;
            
                  // ...
            
                  case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
              }, 
              () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    onUpload(downloadURL)
                });
              });
        }
        else if(startUpload == true && !file){
          onError("No image to upload")
        }
    }, [startUpload])

 
   

    return (
        <CustomFormGroup>
            <Label>{label}</Label>
            <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
            <ProgressBar complete={progress} />
        </CustomFormGroup>
    )
}
