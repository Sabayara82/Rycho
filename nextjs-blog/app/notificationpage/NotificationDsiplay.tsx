"use client";

import axios from "axios";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Notification {
    postId: string;
    userId: string;
    Type: string;
    Text: string;
    Time: string;

}

export default function NotificationDisplay() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [change, setChange] = useState<boolean>(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (!change) {
            fetchNotifications();
        }
        setChange(false);
    }, [change]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/notifications?action=getNotifications&userId=${params.userId}`);
            const { notif } = response.data;
            setNotifications(notif);
        } catch (error) {
            console.error("Error fetching notifications: ", error);
        }
    };





    


    const handleUserClick = (notification:Notification) => {

    };

    return (
        <div className="container mx-auto mt-8 px-4">
            <h1 className="text-4xl font-semibold mb-8">Notifications</h1>
            <div className="grid grid-cols-3 gap-4">
                {notifications.map((notification) => (
                    <div key={notification.postId} className="flex flex-col items-center">
                        <button onClick={() => handleUserClick(notification)} className="relative">

                            <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center p-1 rounded-b-md">
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}