
import { getFirestore, collection, addDoc, setDoc, updateDoc, doc, getDoc} from "firebase/firestore"

export const addNew = async (collectionName, payload) => {
    const db = getFirestore()
    const docRef = await addDoc(collection(db, collectionName), payload)
    return docRef
}

export const addNewWithDocId = async (collectionName, docID, payload)=>{
    const db = getFirestore();
    const docRef = await setDoc(doc(db, collectionName, docID), payload);
    return docRef;
}

export const update = async(collectionName, docID, payload)=>{
    
    const db = getFirestore()
    const docRef = doc(db, collectionName, docID)
    await updateDoc(docRef, payload);
    return true
}


export const getSingleDoc = async(collectionName, docID)=>{

    const db = getFirestore()
    const docRef = doc(db, collectionName, docID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()
    } else {
    // doc.data() will be undefined in this case
        return false
    }

}

