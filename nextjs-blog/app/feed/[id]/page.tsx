"use client"

import axios from "axios";
import React, { useEffect, useState } from 'react';

export default function Feed({params} : {params: {id: string}}) {  
    const [token, setToken] = useState<string | null>(null);
    const [spotifyId, setId] = useState<string | null>(null); 
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [ableFeed, setableFeed] = useState<boolean>(true); 
    const [userNames, setUserNames] = useState<Map<string, string>>(new Map());
    const [likingInteraction, setlikingInteraction] = useState<boolean[]>([]); 


  
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
        retriveTheUser()
      }
    }, [token, posts]);


    const fetchMyFollowing = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${spotifyId}`);
        const { following } = data;
        const newFollowingIds = []; 
        //you loop through every index and get the spotifyID
        for(let x = 0; x < following.length; x++){
          newFollowingIds.push(following[x].spotifyId)
        } 
        setFollowingIds(newFollowingIds)

      } catch (error) {
        console.error("Error fetching followers count: ", error);
        if (ableFeed) { 
          setableFeed(false);
        }
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
          allOfThePosts.push(...allPosts);
        }
        catch(error){
          console.error("Error fetching user's posts': ", error);
          if (ableFeed) { 
            setableFeed(false);
          }
        }
      }
  
      const sortedPosts = allOfThePosts.sort((a, b) => b.updatedAt - a.updatedAt);
      setPosts(sortedPosts);
      console.log(sortedPosts)
    }

    // creating the function that gets the userDetails based off of the ID
    const retriveTheUser = async () => {
      const newUserNames = new Map<string, string>();
      try{
        const userInfo = await axios.get(
          `http://localhost:3000/api/users/profile/?action=getAllUsers`
        )
        let temp = userInfo.data.allUsers
        console.log(temp)
        for(let x = 0; x < temp.length; x++){
          newUserNames.set(temp[x].spotifyId, temp[x].username)
        }
        setUserNames(newUserNames); 
      }catch(error){
        console.error("Error fetching the user's information: ", error);      
      }
    }
  
    // maniuplate the likes 
    const sendTheLikes = async (likedIndex : number) => {
      // you liked to be true, so it changes the color of the button
      // you have to call on the api to change the actual value in the database
      // this is only called when the button is pressed
      // you should only change the count based by the boolean
    }
    return (
      <>
          {ableFeed ? (
              posts.map((post, index) => (
                  <div key={index}>
                      <div className = "theUser"> 
                      {/* take the userNames and given the post.spotifyId, map it to it*/}
                        <p>{userNames.get(post.spotifyId)}</p>
                        <p>{post.updatedAt}</p>
                        <p>{post.caption}</p>
                      </div>
                      <div className = "theSong"> 
                        <p>{post.albumName}</p>
                        <p>{post.songName}</p>
                        <p>{post.caption}</p>
                      </div> 
                      <div className = "interactions">
                        {/* here we want a like button that would then increase the count */}
                        <div className = "theLikes"> 
                          <button> LIKES </button>
                          <p>{post.likes}</p>
                        </div>
                        <p>the comments here</p>
                      </div>
                  </div>
              ))
          ) : (
              <>No Followers</>
          )}
      </>
  );
    
}