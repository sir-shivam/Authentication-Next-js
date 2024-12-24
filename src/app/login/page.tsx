"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Loginpage() {
    const router = useRouter();
    const [user , setUser] = React.useState({
        email: "",
        password: "",

    })
    const [loading , setLoading ] = React.useState(false);
    const [buttonDisabled ,  setButtonDisabled] = React.useState(true); 


    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("login success", response.data)
            toast.success("login success");
            router.push("/profile")
        } catch (error:any) {
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user.email.length >0  && user.password.length > 0){
            setButtonDisabled(false);
        }else{
            setButtonDisabled(true);
        }
    },[user])

  return (
    <div className="flex flex-col items-center justify-center h-svh  ">
        <h1>{loading ? "Login" : "Processing"}</h1>
         <hr />
         
            <label htmlFor="email" >email</label>
         <input 
            className="p-2 border text-black border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600  "
            id="email"
            type="text"
            value={user.email}
            onChange={(e) =>  setUser({...user , email:e.target.value  } )}
            placeholder="Username"
            />
            <label htmlFor="password" >Password</label>
         <input 
            className="p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600  "
            id="password"
            type="password"
            value={user.password}
            onChange={(e) =>  setUser({...user , password:e.target.value  } )}
            placeholder="Username"
            />

            <button 
            onClick={onLogin}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">SignUp Here</button>
            <Link href="/signup" >Visit SignUp</Link>
    </div>
  )
}
