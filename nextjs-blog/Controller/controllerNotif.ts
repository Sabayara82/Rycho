import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConficNot";
import Notifications from "@/models/notificationsModel";

connect()

export async function POST(request: NextRequest) {
    const req = await request.json()
    if (req.method === 'addNotif') {
        try {
            const { Id, postID, userID, Type, FromUserId, Text, Time } = req.body;
            const existingNotif = await Notifications.findOne({ Id });

            if (existingNotif) {
                return NextResponse.json({error: "Notification already exists"}, {status: 400});
            } else {
                const newNotif= new Notifications ({
                    Id, 
                    postID, 
                    userID, 
                    Type, 
                    FromUserId, 
                    Text, 
                    Time
                })
        
                const savedNotif= await newNotif.save()
                console.log(savedNotif);
        
                return NextResponse.json({
                    message: "User created successfully",
                    success: true,
                    savedNotif
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

export async function GET(request: NextRequest) {
    try {
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


