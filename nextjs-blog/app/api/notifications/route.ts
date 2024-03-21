import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConficNot";
import Notifications from "@/models/notificationsModel";



export async function POST(request: NextRequest) {
    const { method, postId, userId, Type, FromUserId, Text, Time } = await request.json();

    if (method === 'addNotif') {
        try {
            await connect()
            const newNotif= new Notifications ({
                postId, 
                userId, 
                Type, 
                FromUserId, 
                Text, 
                Time
            });
    
            const savedNotif= await newNotif.save()
            console.log(savedNotif);
    
            return NextResponse.json({
                message: "Notification created successfully",
                success: true,
                savedNotif
            })
            }catch (error: any) {
            return NextResponse.json({error: error.message},
                {status: 500})
        }
    } else {
        return NextResponse.json({error: 'Method Not Allowed'},
            {status: 405})
    }
}

export async function GET(request: NextRequest) {

    try {
        await connect()
        const urlParams = new URLSearchParams(request.url.split("?")[1]);
        const action = urlParams.get("action");
        const userId = urlParams.get("userId");

        if (action === 'getNotifications') {
            if (!userId) {
                return NextResponse.json({ error: "User ID parameter is missing" }, { status: 400 });
            }
            // Retrieve notifications based on the user ID

            const notifications = await Notifications.find({ userId }); 
            return NextResponse.json({ notifications });
            
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


