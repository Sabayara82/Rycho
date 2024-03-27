"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function FavSong({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [spotifyId, setId] = useState<string | null>(null);
  const [hasFavSong, sethasFavSong] = useState(""); 
  const [posts, setPosts] = useState<any[]>([]);
  const [sizeOfPosts, setsizeOfPosts] = useState(0); 
  const [showSongs, setShowSongs] = useState(false); 
  const [showPopup, setShowPopup] = useState(false); 
  const [selectedSong, setSongName] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [artistName, setAritistName] = useState(""); 

  useEffect(() => {
    let id = window.localStorage.getItem("spotifyid");
    let storedToken = window.localStorage.getItem("token");
    setId(id);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
    }
  }, [token]);

  useEffect(() => {
    fetchTheSongs();
  }, [posts, sizeOfPosts]);
  // this is with the get with the fetchTheSongs
  const fetchTheSongs = async () => {
    try{
      const response = await axios.get(
        `http://localhost:3000/api/feed/post/?spotifyId=${spotifyId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response.data)
      setPosts(response.data.allPosts); 
      console.log(response.data.allPosts.length);
      setsizeOfPosts(response.data.allPosts.length)
    }catch(error){
      console.error("Let's go: ", error); 
    }
  }

  const displayTheSongs = () => {
    setShowSongs(!showSongs);
    console.log(posts)
    console.log("this is the size of it", sizeOfPosts)
  };
  
  const goBack = () => {
    router.push("/profile/" + params.id); 
  }

  const selectingSong = (id: string, name: string, artist : string, url: string) => {
    sethasFavSong(id); 
    setShowPopup(true);
    setSongName(name); 
    setAudioUrl(url); 
    setAritistName(artist);
    // i think this will glitch but lets see
    // router.push("/profile/" + params.id); 
  }

  const itisFinal = async () => {
    try {
      const requestBody = {
          spotifyId: spotifyId,
          audioURL: audioUrl,
          artistName: artistName,
          songName: selectedSong
      };

      const response = await axios.post(`http://localhost:3000/api/feed/theSong`, requestBody);
      console.log('Response:', response.data);
   
  } catch (error: any) {
      console.error('Error:', error.response.data);
      // Handle error response
  }
    router.push("/profile/" + params.id); 

  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed left-0 mb-8 ml-8">
        <button onClick={goBack} className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to Profile
        </button>
      </div>
      <div className="text-center"> 
        <button onClick={displayTheSongs} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Click to choose your favorite song</button>
      </div>
      {showSongs && sizeOfPosts > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 justify-items-center">
          <p className = "text-black">Can't find the song? You have to post it first before setting it as a favorite</p>
          {posts.map((post: any) => (
            <button key={post._id} onClick={() => selectingSong(post._id, post.songName, post.artistName, post.audioURL)} className="flex items-center bg-black rounded-lg shadow-lg p-4 hover:bg-gray-800">
              <img src={post.imageURL} alt="Album Cover" className="w-24 h-24 rounded-lg mr-4" />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-white">{post.songName}</h2>
                <p className="text-white">{post.albumName}</p>
                <p className="text-white">By {post.artistName}</p>
                <p className="text-white">Likes: {post.likes}</p>
                <p className="text-white">Comments: {post.comments.length}</p>
              </div>
            </button>
          ))}
        </div>
        
      )}
      {showSongs && sizeOfPosts === 0 && <div className="mt-8 text-center text-gray-500">No songs found</div>}
      <div>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-2xl text-black font-bold mb-4">Song Selected!</h2>
              <p className="text-lg text-black">You have selected {selectedSong} as your favorite song</p>
              <div className="flex justify-center mt-4 space-x-4">
              <button onClick={() => setShowPopup(false)} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Close
              </button>
              <button onClick={itisFinal} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Select Song
              </button>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
}
