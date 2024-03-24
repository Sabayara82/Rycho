"use client"

import axios from "axios";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Feed({params} : {params: {id: string}}) {

    const router = useRouter();  
    const [token, setToken] = useState<string | null>(null);
    const [spotifyId, setId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userImage, setUserImage] = useState<string | null>(null);  
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const [posts, setPosts] = useState<any[]>([]);

  
    useEffect(() => {
      let id = window.localStorage.getItem("spotifyid")
      let storedToken = window.localStorage.getItem("token")    
      setId(id)
      setToken(storedToken)
    }, [])  
  
    useEffect(() => {
      if (token) {
        fetchMyFollowing()
        retriveThePosts()
      }
    }, [token, followingIds, posts]);


    const fetchMyFollowing = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${spotifyId}`);
        const { following } = data;
        const newFollowingIds = []; // Create a new array to collect Spotify IDs

        //you loop through every index and get the spotifyID
        for(let x = 0; x < following.length; x++){
          console.log(following[x].spotifyId)
          newFollowingIds.push(following[x].spotifyId)
        } 

        setFollowingIds(newFollowingIds)
        console.log(followingIds)
      } catch (error) {
        console.error("Error fetching followers count: ", error);
      }
    }

    const retriveThePosts = async () => {
      const allOfThePosts = []
      for(let p = 0; p < followingIds.length; p++){
        try{
          const response = await axios.get(
            `http://localhost:3000/api/feed/post/?spotifyId=${followingIds[p]}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const { allPosts } = response.data;
          console.log(posts)
          allOfThePosts.push(...allPosts);
        }
        catch(error){
          console.error("Error fetching user's posts': ", error);
        }
      }
      
      setPosts(allOfThePosts);
    }
  
      return (
        <>HELLO TEST</>
      );
}