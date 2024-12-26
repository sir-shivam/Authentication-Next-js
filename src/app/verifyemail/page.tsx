"use client"

import axios from "axios"

import Link from "next/link"
import React, { useEffect, useState } from "react"

export default function VerifyPage(){
     const [token, setToken ] = useState("");
     const [verified, setVerified] = useState(false);
     const [error , setError] = useState(false);

     const verifyUserEmail = async () =>{
        try {

            await axios.post('/api/users/verifyemail',{token})
            setVerified(true);

            
        } catch (error:any) {
          setError(true);
          console.log(error.respose.data);  
        }
     }

     useEffect(()=>{
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
     },[])

     useEffect(()=>{
        if(token.length > 0 ){
             verifyUserEmail();
        }
     },[token])


     return(
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl"> Verify email</h1>
            <h2 className="p-2 bg-green-500 text-black">
                {token ? `${token}` : "no Token"} 
            </h2>

            {verified && (
                <div>
                    <h2 className="text-2xl">Email Verified</h2>
                    <Link href="/login">
                     Login
                    </Link>
                </div>
            )}

{error && (
                <div>
                    <h2 className="text-2xl bg-red-500">Something Wrong</h2>
                    <Link href="/login">
                     Login
                    </Link>
                </div>
            )}
        </div>
     )

}