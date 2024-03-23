// pages/feed/post/[id]/page.tsx

import axios from "axios";
import { useEffect, useState } from 'react';

export default function PostPage({ params }: { params: { id: string } }) {
  const [token, setToken] = useState<string | null>(null);
  const [songs, setSongs] = useState<any[]>([]); 

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchSongs();
    }
  }, [token]);

  const fetchToken = () => {
    const storedToken = window.localStorage.getItem("token");
    setToken(storedToken);
  }

  const fetchSongs = async () => {
    try {
      const { data } = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
  
      // Extract relevant playlist information
      const extractedPlaylists = data.items.map((item: any) => {
        return {
          name: item.name,
          description: item.description,
          // Add more fields as needed
        };
      });
  
      // Set the fetched playlists
      setSongs(extractedPlaylists);
    } catch (error) {
      console.error("Error fetching playlists: ", error);
    }
  }
  

  return (
    <div>
      <h1>My Playlists</h1>
      <ul>
        {songs.map((playlist, index) => (
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
