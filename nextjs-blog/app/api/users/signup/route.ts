import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody

        console.log(reqBody)

        const user = await User.findOne({email})

        if (user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const newUser = new User ({
            username,
            email,
            password
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message},
        {status: 500})
        
    }
}