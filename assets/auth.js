import {getAuth, onAuthStateChanged} from 'firebase/auth'
import { createContext } from 'react'

export default class auth {
    constructor(){
        this.auth = getAuth()
        this.user = this.auth.currentUser
    }
    checkAuthStatus(fn, setLoading=()=>{}){
       return onAuthStateChanged(this.auth, (user) => {
            if(user)
            fn(true)
            setLoading(false)
        })
    }
}

export const AuthContext = createContext()

