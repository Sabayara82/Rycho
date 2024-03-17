import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";

connect()

export async function POST(request: NextRequest) {
    const req = await request.json()
    if (req.method === 'addUser') {
        try {
            const { spotifyId, username, followers, following } = req.body;
            const existingUser = await User.findOne({ spotifyId });

            if (existingUser) {
                return NextResponse.json({error: "User already exists"}, {status: 400});
            } else {
                const newUser = new User ({
                    spotifyId,
                    username,
                    followers,
                    following
                })
        
                const savedUser = await newUser.save()
                console.log(savedUser);
        
                return NextResponse.json({
                    message: "User created successfully",
                    success: true,
                    savedUser
                })
            }
        } catch (error: any) {
            return NextResponse.json({error: error.message},
                {status: 500})
        }
    } else {
        return NextResponse.json({error: 'Method Not Allowed'},
            {status: 405})
    }
}