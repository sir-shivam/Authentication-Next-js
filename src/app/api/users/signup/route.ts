import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel"

import { NextRequest , NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailer";
// import { sendEmail } from "@/helper/mailer";

connect();

export async function POST(request : NextRequest) {

    try {
        const reqBody = await request.json();
        const {username , email, password} = reqBody;

        console.log(reqBody);
        // already exist user
        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({error: "user alredy exist"}, {status: 400 })
        }

        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        //create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,

        })

        const savedUser = await newUser.save();
        console.log(savedUser);

        //send verificationemail first 
        // await sendEmail({email, emailType: "VERIFY" , userId: savedUser._id});

        await sendEmail({email, emailType: "VERIFY" , userId: savedUser._id});
        console.log("emailsent success");
        return NextResponse.json({
            message: "User created successfully" ,
            success: true,
            savedUser
        });

    } catch (error:any) {
        return NextResponse.json({error: error.message},
            {status: 500})
    }
    
}