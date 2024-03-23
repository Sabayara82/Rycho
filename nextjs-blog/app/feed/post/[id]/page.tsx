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
      const { data } = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });

      // Extract relevant song information
      const extractedSongs = data.items.map((item: any) => {
        return {
          name: item.name,
          artist: item.artists[0].name,
          album: item.album.name,
          image: item.album.images.length > 0 ? item.album.images[0].url : null
        };
      });

      // Set the fetched songs
      setSongs(extractedSongs);
    } catch (error) {
      console.error("Error fetching songs: ", error);
    }
  }

  return (
    <div>
      <h1>Top Songs</h1>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            <div>
              <h2>{song.name}</h2>
              <p>{song.artist}</p>
              <p>{song.album}</p>
              {song.image && <img src={song.image} alt="Album Art" />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
