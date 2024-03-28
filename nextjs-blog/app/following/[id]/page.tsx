"use client";

import axios from "axios";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
    followers: string[];
    following: string[];
    username: string;
    spotifyId: string;
    image: string;
}

export default function FollowingPage({params} : {params: {id: string}}) {
    const router = useRouter();
    const [followingList, setFollowingList] = useState<User[]>([]);

    useEffect(() => {
        fetchFollowingList();
    }, []);

    useEffect(() => {
        if (followingList.length > 0) {
            fetchUserProfile();
        }
    }, [followingList]);

    const fetchFollowingList = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${params.id}`);
            const { following } = response.data;
            setFollowingList(following);
        } catch (error) {
            console.error("Error fetching following list: ", error);
        }
    };

    const fetchUserProfile = async () => {
        const token = window.localStorage.getItem("token");
        try {
            const promises = followingList.map(async (user) => {
                const { data } = await axios.get(`https://api.spotify.com/v1/users/${user.spotifyId}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                return {
                    ...user,
                    image: data.images && data.images.length > 0 ? data.images[1].url : "/user.png"
                };
            });
            const updatedFollowingList = await Promise.all(promises);
            setFollowingList(updatedFollowingList);
        } catch (error) {
            console.error("Error fetching user profiles: ", error);
        }
    };

    const handleUserClick = (spotifyId: string) => {
        router.push(`/profile/${spotifyId}`);
    };

    return (
        <div>
            <h1 className="text-4xl font-semibold mb-4 mt-8 text-center text-black">Following</h1>
            <div className="container mx-auto mt-8 px-4 bg-[#202020] rounded-lg shadow-md max-w-md">
                <div className="divide-y divide-[#404040]">
                    {followingList.map((user, index) => (
                        <div className="flex items-center py-4" onClick={() => handleUserClick(user.spotifyId)}>
                            <div className="flex items-center w-full transition duration-300 bg-[#404040] hover:bg-[#505050] hover:scale-105 hover:cursor-pointer py-2 mx-4 rounded-lg">
                                <img
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
