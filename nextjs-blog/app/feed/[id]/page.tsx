"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Feed({ params }: { params: { id: string } }) {
  const [token, setToken] = useState<string | null>(null);
  const [spotifyId, setId] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [ableFeed, setableFeed] = useState<boolean>(true);
  const [userNames, setUserNames] = useState<Map<string, string>>(new Map());
  const [likingInteraction, setlikingInteraction] = useState<boolean[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentPostId, setcommentPostId] = useState(0);


  const [comments, setComments] = useState<{ [postId: string]: any[] }>({});
  const [visibleCommentsPostId, setVisibleCommentsPostId] = useState(null);
  const [userProfiles, setUserProfiles] = useState<{
    [id: string]: { userName: string; userImage: string | null };
  }>({});
  const [refreshPosts, setRefreshPosts] = useState(false);

  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const [postPlaying, setPostPlaying] = useState<{ [postId: string]: boolean }>(
    {}
  );
  const [hoveredPostId, setHoveredPostId] = useState(null);

  useEffect(() => {
    let id = window.localStorage.getItem("spotifyid");
    let storedToken = window.localStorage.getItem("token");
    setId(id);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchMyFollowing();
      retriveThePosts();
      retriveTheUser();
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
      const { data } = await axios.get(
        `http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${spotifyId}`
      );
      const { following } = data;
      const newFollowingIds = [];
      //you loop through every index and get the spotifyID
      for (let x = 0; x < following.length; x++) {
        newFollowingIds.push(following[x].spotifyId);
      }
      setFollowingIds(newFollowingIds);
      console.log("hello there");
      if (spotifyId !== null) {
        setFollowingIds((prevIds) => [...prevIds, spotifyId]);
      }
      console.log(followingIds);
    } catch (error) {
      console.error("Error fetching followers count: ", error);
      if (ableFeed) {
        setableFeed(false);
      }
    }
  };

  const retriveThePosts = async () => {
    const allOfThePosts = [];

    for (let p = 0; p < followingIds.length; p++) {
      try {
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
      } catch (error) {
        console.error("Error fetching user's posts': ", error);
        if (ableFeed) {
          setableFeed(false);
        }
      }
    }

    const sortedPosts = allOfThePosts
      .sort((a, b) => a.updatedAt - b.updatedAt)
      .reverse();
    setPosts(sortedPosts);
    console.log(sortedPosts.length);
  };

  const creatingTheLikes = async () => {
    const noLikes: boolean[] = [];
    for (let i = 0; i < posts.length; i++) {
      noLikes.push(false);
    }
    console.log(noLikes);
    setlikingInteraction(noLikes);
  };
  // creating the function that gets the userDetails based off of the ID
  const retriveTheUser = async () => {
    const newUserNames = new Map<string, string>();
    try {
      const userInfo = await axios.get(
        `http://localhost:3000/api/users/profile/?action=getAllUsers`
      );
      let temp = userInfo.data.allUsers;
      for (let x = 0; x < temp.length; x++) {
        newUserNames.set(temp[x].spotifyId, temp[x].username);
      }
      setUserNames(newUserNames);
    } catch (error) {
      console.error("Error fetching the user's information: ", error);
    }
  };

  const sendTheLikes = async (likedIndex: number) => {
    console.log(likingInteraction);
    console.log("this is the liking interaction", likedIndex);
    const newLikingInteraction = [...likingInteraction];
    newLikingInteraction[likedIndex] = !newLikingInteraction[likedIndex];
    setlikingInteraction(newLikingInteraction);
    let postID = posts[likedIndex]._id;

    if (newLikingInteraction[likedIndex]) {
      try {
        let numberOfTheLikes = posts[likedIndex].likes + 1;
        const changingLike = await axios.patch(
          `http://localhost:3000/api/feed/post/${postID}`,
          { action: "addALike" }
        );
        console.log(changingLike);
        posts[likedIndex].likes = changingLike;
      } catch (error) {
        console.error("Unable to make the changes");
      }
    } else {
      try {
        const changingLike = await axios.patch(
          `http://localhost:3000/api/feed/post/${postID}`,
          { action: "removeALike" }
        );
        console.log(changingLike);
        posts[likedIndex].likes = changingLike;
        console.log("WE ARE REMOVING A LIKE HERE");
        console.log("this is the updated version", posts[likedIndex].likes);
      } catch (error) {
        console.error("changed index");
      }
    }
  };

  const getUserWebsite = async (index: number) => {
    let userIndex = posts[index].spotifyId;
    window.location.href = `http://localhost:3000/profile/${userIndex}`;
  };

  const addAcomment = async (theInfo: string) => {
    //lets see how this will work umm lol
    const commentData = {
      postId: commentPostId,
      spotifyId: spotifyId,
      content: theInfo,
      numberOfLikes: 0,
    };

    try {
      console.log("we have also entered");
      const theChanges = await axios.post(
        `http://localhost:3000/api/feed/comments`,
        commentData
      );
      console.log("Able to populate");
      const commentOfId = theChanges.savedComment;
      console.log("look here pls", theChanges.data.savedComment._id);
      if (theChanges.status === 200) {
        const commentOfId = theChanges.data.savedComment._id;
        console.log(commentOfId);
        try {
          const addingToTheRest = await axios.patch(
            `http://localhost:3000/api/feed/comments`,
            {
              postId: commentPostId,
              commentId: commentOfId,
            }
          );
        } catch (error) {
          console.error("Oops there is an error for the other", error);
        }
      }
    } catch (error) {
      console.error("oops there is an error", error);
    }

    // if it has passed
  };

  const handleSubmitComment = async (event: React.FormEvent) => {
    console.log("we have entered");
    event.preventDefault();
    setNewComment;
    try {
      await addAcomment(newComment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    setNewComment(event.target.value);
    setcommentPostId(posts[index]._id);
  };


  useEffect(() => {
    const newAudioPlayer = new Audio();
    setAudioPlayer(newAudioPlayer);

    return () => {
      if (newAudioPlayer) {
        newAudioPlayer.pause();
        newAudioPlayer.src = "";
      }
    };
  }, []);

  const playPreview = (audioUrl: string) => {
    if (audioPlayer) {
      audioPlayer.addEventListener("error", (e) => {
        console.error("Error with audio playback:", e);
      });

      if (audioPlayer.src !== audioUrl) {
        audioPlayer.src = audioUrl;
        audioPlayer
          .play()
          .catch((e) => console.error("Error playing the audio:", e));
      } else {
        if (audioPlayer.paused) {
          audioPlayer
            .play()
            .catch((e) => console.error("Error playing the audio:", e));
        } else {
          audioPlayer.pause();
        }
      }
    }
  };

  // Example function to toggle the boolean value for a specific post ID
  const togglePostPlaying = (postId: string) => {
    setPostPlaying((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Toggle the boolean value for the given postId
    }));
  };

  const resetPostPlayingExcept = (postIdToExclude: string) => {
    const updatedPostPlaying: { [postId: string]: boolean } = {};
    Object.keys(postPlaying).forEach((postId) => {
      updatedPostPlaying[postId] =
        postId === postIdToExclude ? postPlaying[postId] : false;
    });
    setPostPlaying(updatedPostPlaying);
  };

  return (
    <div className="bg-black-200 min-h-screen py-8">
      <div className="max-w-lg mx-auto">
        {ableFeed ? (
          posts.map((post, index) => (
            <div
              key={post._id}
              className="bg-gray-500 rounded-md shadow-md p-4 mb-4">
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

  // return (
  //   <div className="min-h-screen bg-transparent rounded-lg">
  //     {posts.length > 0 ? (
  //       posts.map((post) => (
  //         <div
  //           key={post._id}
  //           className="flex flex-col lg:flex-row  bg-zinc-800  justify-between pl-10 w-full max-w-none mx-auto p-8 mb-4 shadow-lg rounded-lg  border-black border-4"
  //         >
  //           <div
  //             className="flex relative ml-auto mr-4 lg:content-left"
  //             onMouseEnter={() => {
  //               setHoveredPostId(post._id);
  //             }}
  //             onMouseLeave={() => {
  //               setHoveredPostId(null);
  //             }}
  //           >
  //             <button
  //               className="text-gray-600 focus:outline-none"
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 playPreview(post.audioURL);
  //                 resetPostPlayingExcept(post._id);
  //                 togglePostPlaying(post._id); // Toggle the boolean value for the post ID
  //               }}
  //             >
  //               {/* Overlay appears on hover */}
  //               {hoveredPostId === post._id && (
  //                 <div className="absolute inset-0 flex justify-center items-center z-10">
  //                   {/* Conditionally show play or pause icon */}
  //                   {postPlaying[post._id] ? (
  //                     <svg
  //                       xmlns="http://www.w3.org/2000/svg"
  //                       className="h-36 w-36" // Adjusted size for visibility
  //                       viewBox="0 0 24 24"
  //                       fill="none" // Changed to 'none' for play/pause icons
  //                       stroke="white" // Changed stroke color for better visibility
  //                     >
  //                       {/* Pause Icon */}
  //                       <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M10 9v6m4-6v6"
  //                       />
  //                     </svg>
  //                   ) : (
  //                     <svg
  //                       xmlns="http://www.w3.org/2000/svg"
  //                       className="h-36 w-36" // Adjusted size for visibility
  //                       viewBox="0 0 24 24"
  //                       fill="none" // Changed to 'none' for play/pause icons
  //                       stroke="white" // Changed stroke color for better visibility
  //                     >
  //                       {/* Play Icon */}
  //                       <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
  //                       />
  //                     </svg>
  //                   )}
  //                 </div>
  //               )}
  //               <Image
  //                 className={`bg-[#ffffff] mr-2 rounded-lg min-w-[150px] max-w-[200px] ${
  //                   hoveredPostId === post._id ? "opacity-50" : "opacity-100"
  //                 }`}
  //                 src={post.imageURL || "/imageplaceholder.png"}
  //                 alt="User"
  //                 width={200}
  //                 height={200}
  //                 unoptimized={true}
  //               />
  //             </button>
  //           </div>
  //           <div className="flex flex-col justify-center items-center mx-auto pl-2 w-2/6 text-center">
  //             <h2 className="text-xl drop-shadow-[2px_2px_rgba(100,149,237,0.8)] uppercase font-semibold text-white hover:text-gray-200">
  //               <a href={post.albumURL} target="_blank">
  //                 {post.songName}
  //               </a>
  //             </h2>
  //             <p className="text-gray-300 text-sm tracking-widest font-bebas-neue-regular ">
  //               By {post.artistName}
  //             </p>
  //             <p className="text-gray-300 text-sm tracking-widest font-bebas-neue-regular ">
  //               Album: {post.albumName}
  //             </p>
  //           </div>
  //           <div className="flex flex-col border-l-4 border-[#832d9b] m-2 p-4 rounded-lg justify-top items-left mr-auto ml-10 w-4/6">
  //             <p className="italic font-light text-reg ">{post.caption}</p>
  //             <p className="text-xs mt-2 text-purple-300">
  //               {new Date(post.createdAt).toLocaleString("en-US", {
  //                 month: "long",
  //                 day: "numeric",
  //                 year: "numeric",
  //                 hour: "numeric",
  //                 minute: "numeric",
  //                 hour12: true,
  //               })}
  //             </p>
  //             <br></br>
  //             <div className="flex text-sm justify-between items-center mt-2">
  //               <div
  //                 className="cursor-pointer"
  //                 onClick={() => {
  //                   setVisibleCommentsPostId(
  //                     visibleCommentsPostId !== post._id ? post._id : null
  //                   );
  //                 }}
  //               >
  //                 Comments: {comments[post._id] ? comments[post._id].length : 0}
  //               </div>
  //               <div className="flex items-center">
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   className="h-6 w-6  text-red-400"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="currentColor"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth="3"
  //                     d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
  //                   />
  //                 </svg>
  //                 <span className="ml-2">{post.likes}</span>
  //               </div>
  //             </div>
  //             {visibleCommentsPostId === post._id &&
  //             comments[post._id] &&
  //             comments[post._id].length > 0 ? (
  //               comments[post._id].map((comment, index) => (
  //                 <div
  //                   key={index}
  //                   className="mt-2 pl-4 border-l-4 border-[#832d9b] ml-2 mr-2 rounded-lg flex items-center"
  //                 >
  //                   {/* Check cache before attempting to fetch */}
  //                   {userProfiles[comment.spotifyId] ? (
  //                     <>
  //                       {userProfiles[comment.spotifyId].userImage ? (
  //                         <Image
  //                           className="bg-[#ffffff] rounded-full mr-2 max-h-12 max-w-12"
  //                           src={
  //                             userProfiles[comment.spotifyId].userImage ||
  //                             "/user.png"
  //                           }
  //                           alt="User"
  //                           width={50} // Set appropriate width
  //                           height={50} // Set appropriate height
  //                           unoptimized={true} // Only if your images are external and can't be optimized by Next.js
  //                           priority
  //                         />
  //                       ) : null}
  //                       {/* Comment Name, Content, and Date */}
  //                       <div>
  //                         <span className="text-sm ">
  //                           <strong>
  //                             <button
  //                               onClick={() => goToUserPage(comment.spotifyId)}
  //                             >
  //                               {userProfiles[comment.spotifyId]?.userName}:
  //                             </button>
  //                           </strong>
  //                         </span>
  //                         <p className="text-sm ">{comment.content}</p>
  //                         <p className="text-xs text-purple-300 ">
  //                           {new Date(comment.createdAt).toLocaleString(
  //                             "en-US",
  //                             {
  //                               month: "long",
  //                               day: "numeric",
  //                               year: "numeric",
  //                               hour: "numeric",
  //                               minute: "numeric",
  //                               hour12: true,
  //                             }
  //                           )}
  //                         </p>
  //                       </div>
  //                     </>
  //                   ) : (
  //                     // Fallback or loading state if profile hasn't been fetched yet
  //                     <span text-sm>Loading user profile...</span>
  //                   )}
  //                 </div>
  //               ))
  //             ) : visibleCommentsPostId === post._id ? (
  //               <p className="mt-2 pl-4 text-sm border-l-4 border-[#832d9b] ml-2 mr-2 rounded-lg">
  //                 No comments available
  //               </p>
  //             ) : null}
  //             <button onClick={() => deletePost(post._id)}>
  //               <div className="h-full pt-10 flex justify-end ">
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   className="h-6 w-6 text-gray-400 hover:text-red-400"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="currentColor"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth={2}
  //                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  //                   />
  //                 </svg>
  //               </div>
  //             </button>
  //           </div>
  //         </div>
  //       ))
  //     ) : (
  //       <div className="text-center text-purple-300 pt-10">
  //         You have no posts!
  //       </div>
  //     )}
  //   </div>
  // );
}
