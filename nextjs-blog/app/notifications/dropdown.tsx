"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { DropDownProps } from "../../components/DropDownProps";

export interface DropDownProps {
  notifications: Notification[];
  showDropDown: boolean;
  toggleDropDown: () => void; // Correct the function type definition if needed
}

export interface Notification {
  postId: string;
  userId: string;
  Type: string;
  FromUserId: string;
  Text: string;
  Time: string;
}


export default function DropDown({
  notifications,
  showDropDown,
  toggleDropDown,
}: DropDownProps): JSX.Element 

// const Dropdowwn: React.FC<DropDownProps> = ({
//   notifications,
//   showDropDown,
//   toggleDropDown
// }: DropDownProps): JSX.Element => {
  
  {
  const [followerUserNames, setFollowerUserNames] = useState<string[]>([]);
  const token = window.localStorage.getItem("token");
  const router = useRouter();

  useEffect(() => {
    const fetchFollowerUserNames = async () => {
      try {
        const userNames = await Promise.all(
          notifications.map(async (notification) => {
            const response = await axios.get(
              `http://localhost:3000/api/users/profile?action=getUserBySpotifyId&spotifyId=${notification.FromUserId}`,
              {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );
            return response.data.user.username;
          })
        );
        setFollowerUserNames(userNames);
      } catch (error) {
        console.error("Error fetching user profiles: ", error);
      }
    };

    fetchFollowerUserNames();
  }, [notifications, token]);

  const onClickHandler = (id: string, type: string): void => {
    if (type === "Like" || type === "comment") {
      router.push(`/SongPage/${id}`);
    } else if (type === "follow") {
      goToUserPage(id);
    }
  };

  const goToUserPage = (userId: string) => {
    window.location.href = `http://localhost:3000/profile/${userId}`;
  };

  return (
    <div
      className={showDropDown ? "dropdown active" : "dropdown"}
      style={{ zIndex: 999 }}
    >
      {notifications.map((notification, index) => (
        <button
          id="dropdown-button"
          key={index}
          className="relative"
          onClick={() =>
            onClickHandler(
              notification.Type === "Like" || notification.Type === "comment"
                ? notification.postId
                : notification.FromUserId,
              notification.Type
            )
          }
        >
          {notification.Type === "Like" && (
            <p>{followerUserNames[index]} liked your post</p>
          )}
          {notification.Type === "comment" && (
            <p>{followerUserNames[index]} commented on your post</p>
          )}
          {notification.Type === "follow" && (
            <p>{followerUserNames[index]} started following you</p>
          )}
        </button>
      ))}
    </div>
  );
};

