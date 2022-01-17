
import { getAuth } from 'firebase-admin/auth'
import nc from 'next-connect'
import admin from 'firebase-admin'
import creds from '../../../fbservercreds.json'


const handler = nc().post(async (req, res) => {
    

    if(!req.body.token)
    res.status(403).json({error: "Unauthorized"})
    

    try{
        if(admin.apps.length == 0)
        admin.initializeApp({
            credential: admin.credential.cert(creds)
        })

          const decoded = await getAuth().verifyIdToken(req.body.token)
        //   console.log("decoded", decoded)
          res.status(200).json({success: decoded})
    }
    catch(err){
        console.log("error", err)
         res.status(403).json({error: "Unauthorized"})
    }
   
   
    
})

export default handler