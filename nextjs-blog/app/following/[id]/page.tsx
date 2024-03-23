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
        <div className="container mx-auto mt-8 px-4">
            <h1 className="text-4xl font-semibold mb-8">Following</h1>
            <div className="grid grid-cols-3 gap-4">
                {followingList.map((user) => (
                    <div key={user.spotifyId} className="flex flex-col items-center">
                        <button onClick={() => handleUserClick(user.spotifyId)} className="relative">
                            <Image
                                src={user.image || "/user.png"}
                                alt="User Avatar"
                                width={128}
                                height={128}
                                priority
                                className="rounded-full mb-2"
                            />
                            <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center p-1 rounded-b-md">
                                <span className="text-sm">{user.username}</span>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}