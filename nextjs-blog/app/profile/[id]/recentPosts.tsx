"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  fetchPosts,
  goToUserPage,
  fetchComments,
  playPreview,
  togglePostPlaying,
} from "@/components/postFunctions";
import { set } from "mongoose";

export default function RecentPosts({
  params,
}: {
  params: { id: string | null; token: string | null };
}) {
  interface Post {
    _id: string;
    spotifyId: string;
    albumName: string;
    albumURL: string;
    songName: string;
    caption: string;
    likes: number;
    roomStat: string;
    comments: string[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  interface UserProfile {
    userName: string;
    userImage: string | null;
  }

  const spotifyId = params.id;
  const token = params.token;
  const [posts, setPosts] = useState<any[]>([]);
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

  const router = useRouter();

  // useEffect to fetch posts when the component mounts
  useEffect(() => {
    if (token && spotifyId) {
      fetchPosts(spotifyId, token, setPosts);
      resetPostPlayingExcept("");
    }
  }, [token, spotifyId, refreshPosts]);

  // useEffect to fetch comments when posts are shown
  useEffect(() => {
    if (posts.length > 0) {
      fetchComments(posts, token, setComments);
    }
  }, [posts]);

  // useEffect to prefetch profiles when comments are shown (optional optimization)
  useEffect(() => {
    const prefetchProfiles = async () => {
      if (visibleCommentsPostId && comments[visibleCommentsPostId]) {
        const commentList = comments[visibleCommentsPostId];
        for (const comment of commentList) {
          if (!userProfiles[comment.spotifyId]) {
            await fetchUserProfile(comment.spotifyId); // Prefetch and cache
          }
        }
      }
    };
    prefetchProfiles();
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

  const fetchUserProfile = async (id: string) => {
    // Return cached profile if available
    if (userProfiles[id]) {
      return userProfiles[id];
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

      // Construct profile object
      const profile: UserProfile = {
        userName: data.display_name,
        userImage: data.images.length > 0 ? data.images[0].url : "/noimage.png",
      };

      setUserProfiles((prev) => ({ ...prev, [id]: profile }));
      // return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // return null; // Or a default profile object
    }
  };

  function confirmDelete(postId: string) {
    const confirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmation) {
      // Call the deletePost function if user confirms
      deletePost(postId);
    }
  }

  const deletePost = async (postId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/feed/post/${postId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setRefreshPosts((prev) => !prev);
    } catch (error) {
      console.error("Error deleting user's posts': ", error);
    }
  };

  const resetPostPlayingExcept = async (postIdToExclude: string) => {
    const updatedPostPlaying: { [postId: string]: boolean } = {};
    Object.keys(postPlaying).forEach((postId) => {
      updatedPostPlaying[postId] =
        postId === postIdToExclude ? postPlaying[postId] : false;
    });
    setPostPlaying(updatedPostPlaying);
  };

  return (
    <div className="min-h-screen bg-transparent rounded-lg">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="flex flex-col lg:flex-row  bg-zinc-800  justify-between pl-10 w-full max-w-none mx-auto p-8 mb-4 shadow-lg rounded-lg  border-black border-4"
          >
            <div
              className="flex relative  justify-center"
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
                    hoveredPostId === post._id ? "opacity-50" : "opacity-100"
                  }`}
                  src={post.imageURL || "/imageplaceholder.png"}
                  alt="User"
                  width={200}
                  height={200}
                  unoptimized={true}
                />
              </button>
            </div>
            <div className="flex flex-col justify-center items-center mx-auto pl-2 pt-4  w-2/6 text-center ">
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
            <div className="flex flex-col border-l-4 border-[#832d9b] m-2 p-4 rounded-lg justify-top items-left mr-auto ml-10 w-4/6">
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
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setVisibleCommentsPostId(
                      visibleCommentsPostId !== post._id ? post._id : null
                    );
                  }}
                >
                  Comments: {comments[post._id] ? comments[post._id].length : 0}
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6  text-red-400"
                    fill="none"
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
                                onClick={() => goToUserPage(comment.spotifyId)}
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

              <button onClick={() => confirmDelete(post._id)}>
                <div className="h-full pt-10 flex justify-end ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400 hover:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-purple-300 pt-10">
          You have no posts!
        </div>
      )}
    </div>
  );
}
