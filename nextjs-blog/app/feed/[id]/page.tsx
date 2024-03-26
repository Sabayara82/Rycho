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
    const [newComment, setNewComment] = useState("");
    const [commentPostId, setcommentPostId] = useState(0);


  
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

    //just creating the array before anything else is made
    useEffect(() => {
      if (posts.length <= 0) {
        creatingTheLikes(); 
      }
    }, [posts]);


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
        console.log("hello there"); 
        if (spotifyId !== null) {
          setFollowingIds(prevIds => [...prevIds, spotifyId]);
        }
        console.log(followingIds)
        
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
  
      const sortedPosts = allOfThePosts.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
      setPosts(sortedPosts);
      console.log(sortedPosts.length)

    }

    const creatingTheLikes = async () => {
      const noLikes: boolean[] = [];
      for (let i = 0; i < posts.length; i++) {
          noLikes.push(false);
      }
      console.log(noLikes); 
      setlikingInteraction(noLikes); 
    }
    // creating the function that gets the userDetails based off of the ID
    const retriveTheUser = async () => {
      const newUserNames = new Map<string, string>();
      try{
        const userInfo = await axios.get(
          `http://localhost:3000/api/users/profile/?action=getAllUsers`
        )
        let temp = userInfo.data.allUsers
        for(let x = 0; x < temp.length; x++){
          newUserNames.set(temp[x].spotifyId, temp[x].username)
        }
        setUserNames(newUserNames); 
      }catch(error){
        console.error("Error fetching the user's information: ", error);      
      }
    }
  
    const sendTheLikes = async (likedIndex : number) => {
      console.log(likingInteraction)
      console.log("this is the liking interaction", likedIndex)
      const newLikingInteraction = [...likingInteraction];
      newLikingInteraction[likedIndex] = !newLikingInteraction[likedIndex];
      setlikingInteraction(newLikingInteraction);
      let postID = posts[likedIndex]._id
      
      if(newLikingInteraction[likedIndex]){
        try{
          let numberOfTheLikes = posts[likedIndex].likes + 1
          const changingLike = await axios.patch(`http://localhost:3000/api/feed/post/${postID}`, {action: 'addALike'});
          console.log(changingLike)
          posts[likedIndex].likes = changingLike.likes;
          console.log("this is the updated version",posts[likedIndex].likes); 
          console.log

        }catch(error){
          console.error("Unable to make the changes")
        }
      }else{
        try{
          const changingLike = await axios.patch(`http://localhost:3000/api/feed/post/${postID}`, {action: 'removeALike'});
          console.log(changingLike.likes)
          posts[likedIndex].likes = changingLike.likes;
          console.log("WE ARE REMOVING A LIKE HERE"); 
          console.log("this is the updated version",posts[likedIndex].likes); 
        }catch(error){
          console.error("changed index")
        }
      }
    }

    const getUserWebsite = async (userIndex: number) => {
      let userIndexx = posts[userIndex].spotifyId;
      window.location.href = `http://localhost:3000/profile/${userIndexx}`;
    };

    const addAcomment = async (theInfo: string) => {
      //lets see how this will work umm lol
      const commentData = {
        postId: commentPostId , 
        spotifyId: spotifyId,
        content: theInfo, 
        numberOfLikes: 0
      };

      try{
        console.log("we have also entered")
        const theChanges = await axios.post(`http://localhost:3000/api/feed/comments`, commentData);
        console.log("Able to populate")
        const commentOfId = theChanges.savedComment
        console.log("look here pls", theChanges.data.savedComment._id); 
        if(theChanges.status === 200){
          const commentOfId = theChanges.data.savedComment._id
          console.log(commentOfId)
          try{
            const addingToTheRest = await axios.patch(`http://localhost:3000/api/feed/comments`, {
              postId: commentPostId,
              commentId: commentOfId
            }); 
          }catch(error){
            console.error("Oops there is an error for the other", error);
          }

        }
      }catch(error){
        console.error("oops there is an error", error); 
      }

      // if it has passed 
    }

    const handleSubmitComment = async (event: React.FormEvent) => {
      console.log("we have entered"); 
      event.preventDefault(); 
      setNewComment
      try {
        await addAcomment(newComment);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) =>{
      setNewComment(event.target.value); 
      setcommentPostId(posts[index]._id); 
    }


    return (
      <div className="bg-black-200 min-h-screen py-8">
        <div className="max-w-lg mx-auto">
          {ableFeed ? (
            posts.map((post, index) => (
              <div className="bg-gray-500 rounded-md shadow-md p-4 mb-4">
                <div className="flex items-start justify-between mb-2">
                  {/* User Details */}
                  <div className="flex items-center">
                    <div className="flex flex-col">
                      <button onClick = {() => getUserWebsite(index)}>{userNames.get(post.spotifyId)}</button>
                      <p className="text-black-500 text-sm">{post.createdAt}</p>
                      <p>{post.caption}</p>
                    </div>
                  </div>
                  {/* Image */}
                  {/* on click it leads u to spotify */}
                  <img src="album-image.jpg" alt="Album Image" className="w-20 h-20 rounded-md" />
                  {/* Album Information */}
                  <div className="flex flex-col items-end">
                    <p>{post.albumName}</p>
                    <p>{post.songName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button onClick={() => sendTheLikes(index)} className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2">
                      {likingInteraction[index] ? "Unlike" : "Like"}
                    </button>
                    <p>{post.likes}</p>
                  </div>
                  {/* figure out how isha did it and how to implement it  */}
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Comments
                  </button>
                  <form onSubmit={handleSubmitComment} className="mt-4">
                    <textarea
                      value={newComment}
                      onChange={(event) => handleCommentChange(event, index)}
                      placeholder="Write a comment..."
                      className="w-full p-2 rounded-md border"
                      rows={3}
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Post Comment</button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <p>No Followers</p>
          )}
        </div>
      </div>
    );
    
}