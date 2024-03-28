"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  followers: string[];
  following: string[];
  username: string;
  spotifyId: string;
  image: string;
}

export default function FollowingPage({ params}: {params: { id: string | null} ;}) {
  const router = useRouter();
  const [followerList, setfollowerList] = useState<User[]>([]);

  useEffect(() => {
    fetchfollowerList();
  }, []);

  useEffect(() => {
    if (followerList.length >= 0) {
      fetchUserProfile();
    }
  }, [followerList]);

  const fetchfollowerList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/profile?action=getFollowers&spotifyId=${params.id}`
      );
      const { followers } = response.data;
      setfollowerList(followers);
    } catch (error) {
      console.error("Error fetching following list: ", error);
    }
  };

  const fetchUserProfile = async () => {
    const token = window.localStorage.getItem("token");
    try {
      const promises = followerList.map(async (user) => {
        const { data } = await axios.get(
          `https://api.spotify.com/v1/users/${user.spotifyId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        return {
          ...user,
          image:
            data.images && data.images.length > 0
              ? data.images[1].url
              : "/user.png",
        };
      });
      const updatedfollowerList = await Promise.all(promises);
      setfollowerList(updatedfollowerList);
    } catch (error) {
      console.error("Error fetching user profiles: ", error);
    }
  };

  const handleUserClick = (spotifyId: string) => {
    router.push(`/profile/${spotifyId}`);
  };

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-4 mt-8 text-center text-black">
        Followers
      </h1>
      <div className="container mx-auto mt-8 px-4 bg-[#202020] rounded-lg shadow-md max-w-md">
        <div className="divide-y divide-[#404040]">
          {followerList.map((user, index) => (
            <div
              key={user.spotifyId}
              className="flex items-center py-4"
              onClick={() => handleUserClick(user.spotifyId)}
            >
              <div className="flex items-center w-full transition duration-300 bg-[#404040] hover:bg-[#505050] hover:scale-105 hover:cursor-pointer py-2 mx-4 rounded-lg">
                <Image
                  src={user.image || "/user.png"}
                  alt="User Avatar"
                  width={64}
                  height={64}
                  className="rounded-full mr-6 mx-4 max-h-16"
                />
                <span className="text-2xl font-medium font-bebas-neue-regular">
                  {user.username}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
