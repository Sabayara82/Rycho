"use client"

import axios from "axios";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Home({ params }) {

  const router = useRouter();  
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [token, setToken] = useState<string | null>(null);
  const [spotifyId, setId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);  
  const [userIsFollowing, setUserFollowing] = useState<number>(0);

  useEffect(() => {
    let id = window.localStorage.getItem("spotifyid")
    let storedToken = window.localStorage.getItem("token")    
    setId(id)
    setToken(storedToken)
  }, [])  

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchMyFollowing()
      fetchFollowers();
      fetchFollowing();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get('https://api.spotify.com/v1/users/' + params.id, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      setUserName(data.display_name);
      if (data.images && data.images.length > 0) {
        setUserImage(data.images[1].url);
      }
    } catch (error) {
      console.error("Error fetching user profile: ", error);
    }
  }

  const fetchMyFollowing = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${spotifyId}`);      
      const {following} = data 
      for (let i = 0; i < following.length; i++) {
        if (following[i].spotifyId === params.id) {
          setUserFollowing(1)
          break
        }
        setUserFollowing(0)
      }
    } catch (error) {
      console.error("Error fetching followers count: ", error);
    }
  }

  const fetchFollowers = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/users/profile?action=getFollowers&spotifyId=${params.id}`);      
      const {followers} = data      
      setFollowers(followers);
    } catch (error) {
      console.error("Error fetching followers count: ", error);
    }
  }

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${params.id}`);
      const {following} = data    
      setFollowing(following);
    } catch (error) {
      console.error("Error fetching following count: ", error);
    }
  }


  const handleFollowButtonClick = async () => {
    try {
      if (userIsFollowing === 1) {
        await axios.delete(`http://localhost:3000/api/users/profile`, {
          data: {
            action: 'removeFollowing',
            spotifyId: spotifyId,
            followUserId: params.id 
          }
        });

        await axios.delete(`http://localhost:3000/api/users/profile`, {
          data: {
            action: 'removeFollower',
            spotifyId: params.id, 
            followUserId: spotifyId 
          }
        });
  
        setUserFollowing(0); 
      } else {
  
        await axios.put(`http://localhost:3000/api/users/profile`, {
          action: 'addFollowing',
          spotifyId: spotifyId,
          followUserId: params.id 
        });
  
        await axios.put(`http://localhost:3000/api/users/profile`, {
          action: 'addFollower',
          spotifyId: params.id, 
          followUserId: spotifyId 
        });
  
        setUserFollowing(1); 
      }
    } catch (error) {
      console.error("Error handling follow/unfollow action: ", error);
    }
  };
  


  const handleFollowingClick = () => {
    router.push("/following/" + params.id);
  };

  const handleFollowersClick = () => {
    router.push("/followers/" + params.id);
  };


  return (
    <div className="flex min-h-screen flex-col bg-[#121212] mt-20 max-w-7xl min-h-96 mx-auto rounded-3xl p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="absolute left-1/2 -translate-x-1/2 text-4xl font-semibold pt-12 text-white">
            Profile
        </h1>
        {spotifyId != params.id && (
          <button 
          className="absolute left-3/4 text-lg font-bebas-neue-regular transition duration-500 border-2 border-white-500 hover:border-[#121212] 
          bg-gray-700 hover:bg-gray-500 rounded-full mt-10 pt-0.5 px-4 ml-auto text-white"
          onClick={handleFollowButtonClick}
        >
          {userIsFollowing === 1 ? "Unfollow" : "Follow"}
        </button>
        
        )}
        
    </div>
        <Image className="bg-[#ffffff] mx-auto rounded-full mt-10 mb-3"
            src={userImage || "/user.png"}
            alt="image not found"
            width={128} 
            height={128} 
            priority
          />
        
        <h3 className="text-xl font-semibold text-center mb-2 text-white">{userName || ("")}</h3>
        <div className="flex justify-center space-x-4 mb-8">
          <a href="#" onClick={handleFollowersClick} className="max-h-8 text-lg font-bebas-neue-regular transition duration-500 border-2 border-white-500 hover:border-[#121212] 
          bg-gray-700 hover:bg-gray-500 rounded-full mt-1 pt-0.5 px-3 text-white">
            {followers.length} Followers
          </a>
          <h1 className="py-2 text-white">|</h1>
          <a href="#" onClick={handleFollowingClick} className="max-h-8 text-lg font-bebas-neue-regular transition duration-500 border-2 border-white-500 hover:border-[#121212]
          bg-gray-700 hover:bg-gray-500 rounded-full mt-1 pt-0.5 px-3 text-white">
            {following.length} Following
          </a>
        </div>
        {spotifyId == params.id && (
          <button className="font-semibold mx-auto max-w-fit transition duration-500 border-2 border-white-500 hover:border-[#121212] bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full py-2 px-6 mb-4 mt-2">
            Create Post
          </button>
        )}
        <div className="mx-auto w-4/6">
          <h3 className="text-2xl font-semibold pb-4 text-white">Recent Posts</h3>
          <div className="bg-[#FFFFFF] min-h-96 rounded-2xl">
            <h3 className="text-center pt-40 text-black">No posts available</h3>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black"></div>
    </div>
  );
}
