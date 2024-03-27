"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import RecentPosts from "./recentPosts";
import backgroundImg from "../../../public/background.png";

export default function Home({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [token, setToken] = useState<string | null>(null);
  const [spotifyId, setId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userIsFollowing, setUserFollowing] = useState<number>(0);
  const [hasFavSong, sethasFavSong] = useState("No selected song"); 
  const [hasFavsome, setAudioOfSong] = useState("No selected song"); 
  const [hasPressed, setPressed] = useState(true); 


  useEffect(() => {
    let id = window.localStorage.getItem("spotifyid");
    let storedToken = window.localStorage.getItem("token");
    setId(id);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchMyFollowing();
      fetchFollowers();
      fetchFollowing();
      gettingFavSong();
      startTing(); 
    }
  }, [token, hasFavsome, hasPressed]);

  useEffect(() => {
      const audioElement = new Audio(hasFavsome);
      audioElement.play().catch(error => {
        console.error("Autoplay prevented:", error);
      });

  }, []); 


  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/users/" + params.id,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setUserName(data.display_name);
      if (data.images && data.images.length > 0) {
        setUserImage(data.images[1].url);
      }
    } catch (error) {
      console.error("Error fetching user profile: ", error);
    }
  };

  const fetchMyFollowing = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${spotifyId}`
      );
      const { following } = data;
      for (let i = 0; i < following.length; i++) {
        if (following[i].spotifyId === params.id) {
          setUserFollowing(1);
          break;
        }
        setUserFollowing(0);
      }
    } catch (error) {
      console.error("Error fetching followers count: ", error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/users/profile?action=getFollowers&spotifyId=${params.id}`
      );
      const { followers } = data;
      setFollowers(followers);
    } catch (error) {
      console.error("Error fetching followers count: ", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/users/profile?action=getFollowing&spotifyId=${params.id}`
      );
      const { following } = data;
      setFollowing(following);
    } catch (error) {
      console.error("Error fetching following count: ", error);
    }
  };

  const handleFollowButtonClick = async () => {
    try {
      if (userIsFollowing === 1) {
        await axios.delete(`http://localhost:3000/api/users/profile`, {
          data: {
            action: "removeFollowing",
            spotifyId: spotifyId,
            followUserId: params.id,
          },
        });

        await axios.delete(`http://localhost:3000/api/users/profile`, {
          data: {
            action: "removeFollower",
            spotifyId: params.id,
            followUserId: spotifyId,
          },
        });

        setUserFollowing(0);
      } else {
        await axios.put(`http://localhost:3000/api/users/profile`, {
          action: "addFollowing",
          spotifyId: spotifyId,
          followUserId: params.id,
        });

        await axios.put(`http://localhost:3000/api/users/profile`, {
          action: "addFollower",
          spotifyId: params.id,
          followUserId: spotifyId,
        });

        setUserFollowing(1);
      }
    } catch (error) {
      console.error("Error handling follow/unfollow action: ", error);
    }
  };

  const handleFollowingClick = () => {
    router.push("/following/" + params.id);
  };

  const handleFollowersClick = () => {
    router.push("/followers/" + params.id);
  };

  const handleAddPost = () => {
    router.push("/feed/post/" + params.id);
  };

  const selectFavSong = () => {
    router.push("/favSong/" + params.id); 
    
  }; 

  const gettingFavSong = async () => {
    console.log("the spotify id", spotifyId)
    console.log("the one that we use !!! ", params.id)
    try{
      const data = await axios.get(`http://localhost:3000/api/feed/theSong?spotifyId=${params.id}`)
      sethasFavSong(data.data.favSong.songName);
      setAudioOfSong(data.data.favSong.audioURL);
      console.log("we are able to retrive",data); 

    }catch(error){
      sethasFavSong("No favourite song"); 
      setAudioOfSong("NONE"); 
    }
  }

  const startTing = async () => {
    const audioElement = new Audio(hasFavsome);
    console.log("eneterer", hasFavsome)
    if(hasFavsome !== "NONE"){
      if(hasPressed){
        audioElement.play()
        console.log("enter", hasFavsome)
      }
      else{
        audioElement.pause();
      }

    }
  }

  const playingTheSong = () => {
    console.log("pressed")
    if(hasFavsome !== "NONE"){
      if(hasPressed){
        setPressed(false); 
      }
      else{
        setPressed(true);
      }
    }
  }

  return (
    <div> 
    <div className="fixed top-20 left-0 flex flex-col rounded-3xl justify-center items-start w-full p-4 z-50">
      <button onClick={playingTheSong} className="flex items-center bg-black hover:bg-black text-white font-bold py-2 px-4 rounded">
        {hasPressed && ("No favourite song" !== hasFavSong)? (
          <img
            src="https://media.discordapp.net/attachments/1200526434062565487/1222469996681101392/audio-spectrum-demo.gif?ex=661654e7&is=6603dfe7&hm=9052a73fb309ce21008148215458eb7f1569c7803393f8ea36c932e91103760a&=&width=960&height=540"
            alt="Your GIF"
            className="w-16 h-16 mr-2"
          /> 
        ) : null}
        {hasPressed ? hasFavSong : "Play user's favorite song"}

        
      </button>
    </div>
    <div className="flex min-h-screen flex-col bg-zinc-800 mt-20 max-w-7xl mx-auto rounded-3xl p-10 relative">
      <div className="absolute inset-0 bg-[url('/background.png')] bg-cover opacity-20 rounded-3xl"></div>




      <div className="relative flex flex-col z-10 mt-[50px]">
        {spotifyId === params.id && (
          <div className="favsong">
            <button onClick={selectFavSong} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              Edit Favourite Song
            </button>
          </div>
        )}


        <div className="flex justify-between items-center mb-8">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-4xl font-semibold pt-12">
            Profile
          </h1>
          {spotifyId != params.id && (
            <button
              className="absolute left-3/4 text-lg font-bebas-neue-regular transition duration-500 border-2 border-white-500 hover:border-[#121212] 
          bg-gray-700 hover:bg-gray-500 rounded-full mt-10 pt-0.5 px-4 ml-auto"
            >
              {userIsFollowing === 1 ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        <Image
          className="bg-[#ffffff] mx-auto rounded-full mt-10 mb-3 max-h-32"
          src={userImage || "/user.png"}
          alt="image not found"
          width={128}
          height={128}
          // fill={true}
          priority
        />

        <h3 className="text-xl font-semibold text-center mb-2">
          {userName || ""}
        </h3>
        <div className="flex justify-center space-x-4 mb-8">
          <a
            href="#"
            onClick={handleFollowingClick}
            className="max-h-8 text-lg font-bebas-neue-regular transition duration-500 border-2 border-white-500 hover:border-[#121212] 
          bg-gray-700 hover:bg-gray-500 rounded-full mt-1 pt-0.5 px-3"
          >
            {followers.length} Followers
          </a>
          <h1 className="py-2">|</h1>
          <a
            href="#"
            onClick={handleFollowingClick}
            className="max-h-8 text-lg font-bebas-neue-regular transition duration-500 border-2 border-white-500 hover:border-[#121212]
          bg-gray-700 hover:bg-gray-500 rounded-full mt-1 pt-0.5 px-3"
          >
            {following.length} Following
          </a>
        </div>
        {spotifyId == params.id && (
          <button onClick={handleAddPost} className="font-semibold mx-auto max-w-fit transition duration-500 border-2 border-white-500 hover:border-[#121212] bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full py-2 px-6 mb-4 mt-2">
            Create Post
          </button>
        )}
        <div className="mx-auto w-4/6">
          <h3 className="text-2xl font-semibold pb-4">
            <RecentPosts params={{ id: params.id, token: token }} />
          </h3>
        </div>
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black"></div>
      </div>
    </div>
    </div>
  );
}

