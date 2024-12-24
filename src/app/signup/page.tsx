"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";


export default function Signuppage() {
    const router = useRouter();
    const [loading , setLoading] = React.useState(false);
    const [user , setUser] = React.useState({
        email: "",
        password: "",
        username:"",

    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);


    const onSignUp = async () => {
        try {
            setLoading(true);
            const response =  await axios.post("/api/users/signup" , user);
            console.log(response.data);
            router.push("/login");
        } catch (error:any) {
            console.log(error.message , "Signup failed");
            toast.error(error.message)
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user.email.length > 0 && user.password.length && user.username.length > 0){
            setButtonDisabled(false);
        }else{
            setButtonDisabled(true)
        }
    },[user])

  return (
    <div className="flex flex-col items-center justify-center h-svh  ">
        <h1>{loading? "Processing" : "SignUp"} </h1>
         <hr />
         <label htmlFor="username" >User Name</label>
         <input 
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black "
            id="username"
            type="text"
            value={user.username}
            onChange={(e) =>  setUser({...user , username:e.target.value  } )}
            placeholder="Username"
            />
            <label htmlFor="email" >email</label>
         <input 
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black "
            id="email"
            type="text"
            value={user.email}
            onChange={(e) =>  setUser({...user , email:e.target.value  } )}
            placeholder="Username"
            />
            <label htmlFor="password" >Password</label>
         <input 
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black "
            id="password"
            type="password"
            value={user.password}
            onChange={(e) =>  setUser({...user , password:e.target.value  } )}
            placeholder="Username"
            />

            <button 
            onClick={onSignUp}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">{buttonDisabled ? "can't sign" : "SignUp Here"}</button>
            <Link href="/login" >Visit Login</Link>
    </div>
  )
}
