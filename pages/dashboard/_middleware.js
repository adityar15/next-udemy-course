import { NextResponse } from "next/server"

export async function middleware(req, ev){
    

   const request = await fetch(`${process.env.PROJECT_URL}/api/user/checkAuthStatus`, {
        method: "POST",
        body: JSON.stringify({token: req.cookies.token}),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const res = await request.json()
    if(res.error)
    return NextResponse.redirect("/login")

    const response = NextResponse.next()
    response.cookie('uid', res.success.uid) 
    return response
}