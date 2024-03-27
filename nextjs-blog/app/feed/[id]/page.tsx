"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  fetchPosts,
  goToUserPage,
  fetchComments,
  playPreview,
  togglePostPlaying,
} from "@/components/postFunctions";
import { setDefaultAutoSelectFamily } from "net";
import { setDefaultHighWaterMark } from "stream";

export default function Feed({ params }: { params: { id: string } }) {
  const spotifyId = params.id;
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  const [ableFeed, setableFeed] = useState<boolean>(true);
  const [userProfiles, setUserProfiles] = useState<{
    [id: string]: { userName: string; userImage: string | null };
  }>({});
  // const [userNames, setUserNames] = useState<Map<string, string>>(new Map());
  const [likingInteraction, setlikingInteraction] = useState<boolean[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentPostId, setcommentPostId] = useState(0);

  const [comments, setComments] = useState<{ [postId: string]: any[] }>({});
  const [visibleCommentsPostId, setVisibleCommentsPostId] = useState(null);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [postPlaying, setPostPlaying] = useState<{ [postId: string]: boolean }>(
    {}
  );
  const [hoveredPostId, setHoveredPostId] = useState(null);

  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
  }, []);

  // Fetch user's posts and comments on initial render
  useEffect(() => {
    if (token && spotifyId) {
      fetchMyFollowing();
      resetPostPlayingExcept("");
    }
  }, [token, spotifyId, refreshPosts]);

  //  Fetch posts when followingIds are updated
  useEffect(() => {
    if (followingIds) {
      fetchPosts(followingIds, token, setPosts);
      fetchUserProfiles();
    }
  }, [followingIds]);

  //just creating the array before anything else is made
  useEffect(() => {
    if (posts.length <= 0) {
      creatingTheLikes();
    } else if (posts.length > 0) {
      fetchComments(posts, token, setComments);
    }
  }, [posts]);

  // useEffect to prefetch profiles when comments are shown (optional optimization)
  useEffect(() => {
    fetchComments(posts, token, setComments);
  }, [visibleCommentsPostId, comments, userProfiles]);

  // useEffect to create an audio player when the component mounts
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

  const fetchMyFollowing = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${spotifyId}`
      );
      const { following } = data;
      const newFollowingIds: React.SetStateAction<string[]> = [];

      for (let x = 0; x < following.length; x++) {
        const id = following[x].spotifyId;
        // Check if the id is already in the array
        if (!newFollowingIds.includes(id)) {
          newFollowingIds.push(id);
        }
      }

      // Check if spotifyId is not null and unique
      if (spotifyId && !newFollowingIds.includes(spotifyId)) {
        newFollowingIds.push(spotifyId);
      }

      setFollowingIds(newFollowingIds);
    } catch (error) {
      console.error("Error fetching followers count: ", error);
      if (ableFeed) {
        setableFeed(false);
      }
    }
  };

  const fetchUserProfiles = async () => {
    // Return cached profile if available
    for (let p = 0; p < followingIds.length; p++) {
      const id = followingIds[p];
      if (userProfiles[id]) {
        continue; // Skip if profile already cached
      }
      try {
        const { data } = await axios.get(
          "https://api.spotify.com/v1/users/" + id,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const profile = {
          userName: data.display_name,
          userImage:
            data.images.length > 0 ? data.images[0].url : "/noimage.png",
        };
        setUserProfiles((prev) => ({
          ...prev,
          [id]: profile,
        }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  const creatingTheLikes = async () => {
    const noLikes: boolean[] = [];
    for (let i = 0; i < posts.length; i++) {
      noLikes.push(false);
    }
    console.log(noLikes);
    setlikingInteraction(noLikes);
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
        const changingLikeResponse = await axios.patch(
          `http://localhost:3000/api/feed/post/${postID}`,
          { action: "addALike" }
        );
        console.log("go go",changingLikeResponse); 
        if(changingLikeResponse.status === 200){
          try{
          const lettingItNow = await axios.post(`http://localhost:3000/api/notifications`, 
            {
              method: "addNotif", 
              postId: postID,
              userId: findSpotifyIdById(postID), 
              Type: "Like",
              FromUserId: spotifyId,
              Time: new Date() 
            }
          )
          console.log("hello",lettingItNow)
        }catch(error){
          console.error("Unable to make the changes"); 
        }
        const updatedLikes = changingLikeResponse.data.likes;
        const updatedPosts = [...posts];
        updatedPosts[likedIndex].likes = updatedLikes;
        setPosts(updatedPosts);
        }
      } catch (error) {
        console.error("Unable to make the changes");
      }
    } else {
      try {
        const changingLikeResponse = await axios.patch(
          `http://localhost:3000/api/feed/post/${postID}`,
          { action: "removeALike" }
        );
        const updatedLikes = changingLikeResponse.data.likes;
        const updatedPosts = [...posts];
        updatedPosts[likedIndex].likes = updatedLikes;
        setPosts(updatedPosts);
      } catch (error) {
        console.error("Unable to make the changes");
      }
    }
  };

  const addAComment = async (theInfo: string) => {
    //lets see how this will work umm lol
    const commentData = {
      postId: commentPostId,
      spotifyId: spotifyId,
      content: theInfo,
      numberOfLikes: 0,
    };
    console.log("please look here", commentData)
    console.log("look here", params.id)
    console.log("heyyyy", posts)
    http://localhost:3000/api/notifications api-> 
    // like button -> 
      // postId, userId (kenzy the person that made post), FromUserid (nessma-person making like), Type (Like), Time(date)
    // postId, userId (kenzy the person that made post), FromUserid (nessma-person making comment), Type (comment),Text(what commented), Time(date) 

    console.log(commentData)
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
          console.log(addingToTheRest)
          if(addingToTheRest.status){
            const addingToRest = await axios.post(
              `http://localhost:3000/api/notifications`, {
                method: "addNotif", 
                postId: commentPostId,
                userId: findSpotifyIdById(commentPostId), 
                Type: "comment",
                FromUserId: spotifyId,
                Text: theInfo, 
                Time: new Date() 
              }
            )
            console.log(findSpotifyIdById(commentPostId))
            console.log("success",addingToRest)
          }
          
        } catch (error) {
          console.error("Oops there is an error for the other", error);
        }
      }
    } catch (error) {
      console.error("oops there is an error", error);
    }

    // if it has passed
  };

  function findSpotifyIdById(_id : number) {
    for (const post of posts) {
      if (post._id === _id) {
        return post.spotifyId;
      }
    }
    return null; // Return null if _id is not found
  }

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    setNewComment("");
    try {
      await addAComment(newComment);
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

  const resetPostPlayingExcept = (postIdToExclude: string) => {
    const updatedPostPlaying: { [postId: string]: boolean } = {};
    Object.keys(postPlaying).forEach((postId) => {
      updatedPostPlaying[postId] =
        postId === postIdToExclude ? postPlaying[postId] : false;
    });
    setPostPlaying(updatedPostPlaying);
  };

  return (
    // <div className="min-h-screen bg-transparent rounded-lg">
    <div className="bg-black-200 min-h-screen py-8">
      <div className="mx-10">
        {ableFeed ? (
          posts.map((post, index) => (
            <div
              key={post._id}
              className="flex flex-col lg:flex-row  bg-zinc-800  justify-between pl-10 w-full max-w-none mx-auto p-8 mb-4 shadow-lg rounded-lg  border-black border-4"
            >
              <div className="flex flex-col justify-center items-center">
                <div className="pb-4 text-lg">
                  <strong>
                    <button
                      onClick={() => goToUserPage(posts[index].spotifyId)}
                    >
                      {userProfiles[post.spotifyId]?.userName}
                    </button>
                  </strong>
                </div>
                <div
                  className="flex relative mx-auto"
                  onMouseEnter={() => {
                    setHoveredPostId(post._id);
                  }}
                  onMouseLeave={() => {
                    setHoveredPostId(null);
                  }}
                >
                  <button
                    className="text-gray-600 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPreview(audioPlayer, post.audioURL);
                      resetPostPlayingExcept(post._id);
                      togglePostPlaying(
                        setPostPlaying,
                        postPlaying.prevState,
                        post._id
                      ); // Toggle the boolean value for the post ID
                    }}
                  >
                    {/* Overlay appears on hover */}
                    {hoveredPostId === post._id && (
                      <div className="absolute inset-0 flex justify-center items-center z-10">
                        {/* Conditionally show play or pause icon */}
                        {postPlaying[post._id] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-36 w-36" // Adjusted size for visibility
                            viewBox="0 0 24 24"
                            fill="none" // Changed to 'none' for play/pause icons
                            stroke="white" // Changed stroke color for better visibility
                          >
                            {/* Pause Icon */}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 9v6m4-6v6"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-36 w-36" // Adjusted size for visibility
                            viewBox="0 0 24 24"
                            fill="none" // Changed to 'none' for play/pause icons
                            stroke="white" // Changed stroke color for better visibility
                          >
                            {/* Play Icon */}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                    <Image
                      className={`bg-[#ffffff] mr-2 rounded-lg min-w-[150px] max-w-[200px] ${
                        hoveredPostId === post._id
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                      src={post.imageURL || "/imageplaceholder.png"}
                      alt="User"
                      width={200}
                      height={200}
                      unoptimized={true}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col pt-4 justify-center items-center mx-auto pl-2 w-2/6 text-center ">
                <h2 className="text-xl drop-shadow-[2px_2px_rgba(100,149,237,0.8)] uppercase font-semibold text-white hover:text-gray-200">
                  <a href={post.albumURL} target="_blank">
                    {post.songName}
                  </a>
                </h2>
                <p className="text-gray-300 text-sm tracking-widest font-bebas-neue-regular ">
                  By {post.artistName}
                </p>
                <p className="text-gray-300 text-sm tracking-widest font-bebas-neue-regular ">
                  Album: {post.albumName}
                </p>
              </div>

              <div className="flex flex-col border-l-4  border-[#832d9b] m-2 p-4 rounded-lg justify-top items-left mr-auto ml-10 w-4/6 ">
                <p className="italic font-light text-reg ">{post.caption}</p>
                <p className="text-xs mt-2 text-purple-300">
                  {new Date(post.createdAt).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
                <br></br>
                <div className="flex text-sm justify-between items-center mt-2">
                  <div className="flex flex-col">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setVisibleCommentsPostId(
                          visibleCommentsPostId !== post._id ? post._id : null
                        );
                      }}
                    >
                      Comments:{" "}
                      {comments[post._id] ? comments[post._id].length : 0}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => sendTheLikes(index)}
                      className="flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-400"
                        fill={likingInteraction[index] ? "red" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="ml-2">{post.likes}</span>
                    </button>
                  </div>
                </div>

                {visibleCommentsPostId === post._id &&
                comments[post._id] &&
                comments[post._id].length > 0 ? (
                  comments[post._id].map((comment, index) => (
                    <div
                      key={index}
                      className="mt-2 pl-4 border-l-4 border-[#832d9b] ml-2 mr-2 rounded-lg flex items-center"
                    >
                      {/* Check cache before attempting to fetch */}
                      {userProfiles[comment.spotifyId] ? (
                        <>
                          {userProfiles[comment.spotifyId].userImage ? (
                            <Image
                              className="bg-[#ffffff] rounded-full mr-2 max-h-12 max-w-12"
                              src={
                                userProfiles[comment.spotifyId].userImage ||
                                "/user.png"
                              }
                              alt="User"
                              width={50} // Set appropriate width
                              height={50} // Set appropriate height
                              unoptimized={true} // Only if your images are external and can't be optimized by Next.js
                              priority
                            />
                          ) : null}
                          {/* Comment Name, Content, and Date */}
                          <div>
                            <span className="text-sm ">
                              <strong>
                                <button
                                  onClick={() =>
                                    goToUserPage(comment.spotifyId)
                                  }
                                >
                                  {userProfiles[comment.spotifyId]?.userName}:
                                </button>
                              </strong>
                            </span>
                            <p className="text-sm ">{comment.content}</p>
                            <p className="text-xs text-purple-300 ">
                              {new Date(comment.createdAt).toLocaleString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                }
                              )}
                            </p>
                          </div>
                        </>
                      ) : (
                        // Fallback or loading state if profile hasn't been fetched yet
                        <span text-sm>Loading user profile...</span>
                      )}
                    </div>
                  ))
                ) : visibleCommentsPostId === post._id ? (
                  <p className="mt-2 pl-4 text-sm border-l-4 border-[#832d9b] ml-2 mr-2 rounded-lg">
                    No comments available
                  </p>
                ) : null}
                <form onSubmit={handleSubmitComment} className="mt-4 text-sm">
                  <textarea
                    value={(comments[post._id]===post._id) ? newComment: undefined}
                    onChange={(event) => handleCommentChange(event, index)}
                    placeholder="Write a comment..."
                    className="w-full p-2 rounded-md border text-black"
                    rows={1}
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                  >
                    Post Comment
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <strong><p className="text-black text-center">Not Following Any Users</p></strong>
        )}
      </div>
    </div>
  );
}
