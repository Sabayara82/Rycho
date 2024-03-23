// pages/feed/post/[id]/page.tsx

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Song {
  name: string[];
  description: string[];
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [token, setToken] = useState<string | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]); 
  const router = useRouter();

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchPlaylistSongs();
    }
  }, [token]);

  const fetchToken = () => {
    const storedToken = window.localStorage.getItem("token");
    setToken(storedToken);
  }

  const fetchPlaylistSongs = async () => {
    const storedToken = window.localStorage.getItem("token");
    try {
      const { data } = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: 'Bearer ' + storedToken // Use storedToken instead of token
        }
      });
  
      // Extract relevant playlist information
      const extractedPlaylists = data.items.map((item: any) => {
        return {
          name: item.name,
          description: item.description,
        };
      });
  
      // Set the fetched playlists
      setPlaylistSongs(extractedPlaylists); // Changed to setPlaylistSongs
    } catch (error) {
      console.error("Error fetching playlists: ", error);
    }
  }

  return (
    <div>
      <h1>My Playlists</h1>
      {/* Display playlist information */}
      <ul>
        {playlistSongs.map((playlist, index) => (
          <li key={index}>
            <div>
              <h2>{playlist.name}</h2>
              <p>{playlist.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
