"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function RecentPosts({
  params,
}: {
  params: { id: string|null, token: string|null };
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
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (token && spotifyId) {
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

        }
      } catch (error) {
        console.error("Error fetching user's posts': ", error);
      }
    };

    fetchPosts(); // Call fetchPosts initially

    return () => {
      setPosts([]); 
    };

  }, [token, spotifyId]); 


  console.log(posts);

  return (
    <div>
    {posts.length > 0 ? (
      posts.map((post) => (
        <div key={post._id} className="post">
          <h2>{post.albumName}</h2>
          <p>
            Album URL: <a href={post.albumURL}>{post.albumURL}</a>
          </p>
          <p>Song Name: {post.songName}</p>
          <p>Caption: {post.caption}</p>
          <p>Likes: {post.likes}</p>
          <p>Comments: {post.comments.length}</p>
          <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
        </div>
      ))
    ) : (
      <div>no posts available</div>
    )}
  </div>
  );
}
