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

  const spotifyId = params.id;
  const token = params.token;
  const [posts, setPosts] = useState<any[]>([]);
  // const [comments, setComments] = useState<any[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: any[] }>({});
  const [showComments, setShowComments] = useState(false);
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

  // console.log(posts.length);

  // return (
  //   <div>
  //     {posts.length > 0 ? (
  //       posts.map((post) => (
  //         <div key={post._id} className="post">
  //           <h2>{post.albumName}</h2>
  //           <p>
  //             Album URL: <a href={post.albumURL}>{post.albumURL}</a>
  //           </p>
  //           <p>Song Name: {post.songName}</p>
  //           <p>Caption: {post.caption}</p>
  //           <p>Likes: {post.likes}</p>
  //           <p>Comments:</p>
  //           {comments[post._id] && comments[post._id].length > 0 ? (
  //             comments[post._id].map((comment, index) => (
  //               <p key={index}>
  //                 {comment.content}
  //                 {comment.createdAt}
  //               </p>
  //             ))
  //           ) : (
  //             <p>No comments available</p>
  //           )}
  //           <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
  //         </div>
  //       ))
  //     ) : (
  //       <div>no posts available</div>
  //     )}
  //   </div>
  // );

  // Inside your component
  return (
    <div className="min-h-screen bg-red-900">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="w-full max-w-none mx-auto p-4 mb-4 shadow-lg rounded-lg bg-gradient-to-r from-brown-900 via-navy-800 to-purple-500"
          >
            <h2 className="text-lg font-semibold text-white hover:text-gray-200">
              <a href={post.albumURL}>{post.songName}</a>
            </h2>
            <p className="text-gray-300">Caption: {post.caption}</p>
            <div className="flex justify-between items-center text-gray-300 mt-2">
              <div
                className="cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              >
                Comments: {comments[post._id] ? comments[post._id].length : 0}
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="ml-2">{post.likes}</span>
              </div>
            </div>
            {showComments &&
            comments[post._id] &&
            comments[post._id].length > 0 ? (
              comments[post._id].map((comment, index) => (
                <div
                  key={index}
                  className="mt-2 pl-4 border-l-2 border-purple-500 ml-2 mr-2 rounded-lg"
                >
                  <p className="text-sm text-gray-300">{comment.content}</p>
                  <p className="text-xs text-purple-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : showComments ? (
              <p className="text-purple-400">No comments available</p>
            ) : null}
            <p className="text-xs text-purple-400 mt-2">
              Created At: {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center text-purple-300 pt-10">
          No posts available
        </div>
      )}
    </div>
  );

  ``;
}
