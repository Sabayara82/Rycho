import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody;
        console.log(reqBody);

        const user = await User.findOne({email})

        if (!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }

        const validPassword = password == user.password

        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }

        // const tokenData = {
        //     id: user._id,
        //     username: user.username,
        //     email: user.email
        // }

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}