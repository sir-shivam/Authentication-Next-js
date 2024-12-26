import User from "@/models/userModel"
import {connect} from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/helper/mailer";

connect();

export async function POST(request : NextRequest) {
    
    try {
        const reqBody = await request.json();
        const {token} = reqBody;
        console.log(token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: {$gt: Date.now}
        })
        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        
        return NextResponse.json({
            message: "Email verified Successfully",
            success: true
        })

    } catch (error :any) {
        return NextResponse.json({error: error.message},
            {status:500}
        )
    }

}