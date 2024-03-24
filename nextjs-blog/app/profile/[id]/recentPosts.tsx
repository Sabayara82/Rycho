"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const [userProfiles, setUserProfiles] = useState<{[id: string]: { userName: string; userImage: string | null };}>({});

  const router = useRouter();

  useEffect(() => {
    if (token && spotifyId) {
      fetchPosts();
    }
  }, [token, spotifyId]);

  useEffect(() => {
    if (posts.length > 0) {
      fetchComments();
    }
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/feed/post/?spotifyId=${spotifyId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const { allPosts } = response.data;
      setPosts(allPosts);
    } catch (error) {
      console.error("Error fetching user's posts': ", error);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsMap: { [postId: string]: any[] } = {}; // Define type annotation for commentsMap
      for (let i = 0; i < posts.length; i++) {
        const postId = posts[i]._id;
        const response = await axios.get(
          `http://localhost:3000/api/feed/comments/?postId=${postId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const { allComments } = response.data;
        commentsMap[postId] = allComments; // Assign comments to the post ID key in the comments map
      }

      setComments(commentsMap); // Set comments map to state
    } catch (error) {
      console.error("Error fetching posts' comments: ", error);
    }
  };

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

  return (
    <div className="min-h-screen bg-zinc-800 rounded-lg">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            // from-brown-900 via-navy-800 to-purple-500
            // from-brown-900 via-[#946315] to-[#d9b447]
            // bg-gradient-to-r from-[#2798ba] via-[#4368ce] to-[#6a44dd]
            className="flex justify-between pl-10 w-full max-w-none mx-auto p-8 mb-4 shadow-lg rounded-lg  border-black border-4"
          >
            <div className="flex flex-col justify-center items-center mx-auto w-2/6">
              <Image
                className="bg-[#ffffff] mr-2 rounded-lg min-w-[150px]"
                src={post.imageURL || "/imageplaceholder.png"}
                alt="User"
                width={200} // Increase the width
                height={200} // Increase the height
                unoptimized={true} // Only if your images are external and can't be optimized by Next.js
              />
            </div>
            <div className="flex flex-col justify-center items-center mx-auto w-2/6">
              <h2 className="text-xxl drop-shadow-[2px_2px_rgba(100,149,237,0.8)] uppercase font-semibold text-white hover:text-gray-200">
                <a href={post.albumURL} target="_blank">
                  {post.songName}
                </a>
              </h2>
              <p className="text-gray-300 tracking-widest font-bebas-neue-regular ">
                By {post.artistName}
              </p>
              <p className="text-gray-300 tracking-widest font-bebas-neue-regular ">
                Album: {post.albumName}
              </p>
            </div>
            <div className="flex flex-col border-l-4 border-[#832d9b] m-2 p-8 rounded-lg justify-top items-left mr-auto ml-10 w-4/6">
              <p className="italic font-light ">{post.caption}</p>
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
              <div className="flex justify-between items-center mt-2">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setVisibleCommentsPostId(
                      visibleCommentsPostId !== post._id ? post._id : null
                    )
                  }
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
                            className="bg-[#ffffff] rounded-full mr-2"
                            src={
                              userProfiles[comment.spotifyId].userImage ||
                              "/user.png"
                            }
                            alt="User"
                            width={50} // Set appropriate width
                            height={50} // Set appropriate height
                            unoptimized={true} // Only if your images are external and can't be optimized by Next.js
                          />
                        ) : null}
                        {/* Comment Name, Content, and Date */}
                        <div>
                          <span className="text-sm ">
                            <strong>
                              {userProfiles[comment.spotifyId]?.userName}:
                            </strong>
                          </span>
                          <p className="text-sm ">
                            {comment.content}
                          </p>
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
                      <span>Loading user profile...</span>
                    )}
                  </div>
                ))
              ) : visibleCommentsPostId === post._id ? (
                <p className="mt-2 pl-4 text-sm border-l-4 border-[#832d9b] ml-2 mr-2 rounded-lg">
                  No comments available
                </p>
              ) : null}
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
