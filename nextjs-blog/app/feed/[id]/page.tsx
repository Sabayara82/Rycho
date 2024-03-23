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
    const [followingIds, setFollowingIds] = useState<number[]>([]);

  
    useEffect(() => {
      let id = window.localStorage.getItem("spotifyid")
      let storedToken = window.localStorage.getItem("token")    
      setId(id)
      setToken(storedToken)
    }, [])  
  
    useEffect(() => {
      if (token) {
        fetchMyFollowing()
      }
    }, [token]);


    const fetchMyFollowing = async () => {
        try {
          const { data } = await axios.get(`http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${spotifyId}`);      
          const {following} = data 
          console.log("Following IDs:", following);
        //   lets display something here to see it on the page
        } catch (error) {
          console.error("Error fetching followers count: ", error);
        }
      }
  
      return (
        <>HELLO TEST</>
      );
}