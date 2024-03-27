"use client";
import axios, { AxiosResponse, AxiosError } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import DropDown from "../notifications/Dropdown/page"; // Import the DropDown component
import './styles.css';
interface Notification {
  postId: string;
  userId: string;
  Type: string;
  FromUserId: string;
  Text: string;
  Time: string;
}

export default function NotificationDisplay() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);



  const fetchNotifications = async () => {
    try {
      const response: AxiosResponse = await axios.get(
        "http://localhost:3000/api/notifications",
        {
          params: {
            userId: window.localStorage.getItem("spotifyid"),
          },
        }
      );
      console.log(response.data.notifications);
      const transformedNotifications: Notification[] =
        response.data.notifications.map((notification: any) => ({
          postId: notification.postId,
          userId: notification.userId,
          Type: notification.Type,
          FromUserId: notification.FromUserId,
          Text: notification.Text,
          Time: notification.Time,
        }));
      setNotifications(transformedNotifications);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleDropDown = (): void => {
    setShowDropDown((prevState) => !prevState);
  };

  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target) {
      setShowDropDown(false);
    }};
    return (
      <div className="transition duration-500 border-2 border-white-500 hover:border-[#202020] bg-[#000000] rounded-full h-10 mt-2 w-10 mr-4 flex justify-center items-center cursor-pointer">
        <div
          className={showDropDown ? "active" : undefined}
          onClick={toggleDropDown}
        >
          <Image
            src="/notification.png"
            alt="image not found"
            width={32}
            height={12}
          />
          {showDropDown && (
            <DropDown
              notifications={notifications}
              showDropDown={showDropDown}
              toggleDropDown={toggleDropDown}
            />
          )}
        </div>
      </div>
    );
  };

