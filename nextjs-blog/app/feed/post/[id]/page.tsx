// pages/feed/post/[id]/page.tsx

"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Song {
  name: string;
  artist: string;
  album: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [token, setToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchToken = () => {
      const storedToken = window.localStorage.getItem("token");
      setToken(storedToken);
    }

    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchPlaylists = async () => {
        try {
          const { data } = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: 'Bearer ' + token
            }
          });

          const playlistsData: Playlist[] = data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
          }));

          setPlaylists(playlistsData);
        } catch (error) {
          console.error("Error fetching playlists: ", error);
        }
      }

      fetchPlaylists();
    }
  }, [token]);

  const fetchPlaylistSongs = async (playlistId: string) => {
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });

      const extractedSongs: Song[] = data.items.map((item: any) => ({
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
      }));

      setPlaylistSongs(extractedSongs);
    } catch (error) {
      console.error("Error fetching songs for playlist: ", error);
    }
  }

  return (
    <div>
      <h1>My Playlists</h1>
      {/* Display playlist information */}
      <ul>
        {playlists.map((playlist, index) => (
          <li key={index}>
            <div onClick={() => fetchPlaylistSongs(playlist.id)}>
              <h2>{playlist.name}</h2>
              <p>{playlist.description}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Display playlist songs */}
      <ul>
        {playlistSongs.map((song, index) => (
          <li key={index}>
            <div>
              <h3>{song.name}</h3>
              <p>Artist: {song.artist}</p>
              <p>Album: {song.album}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
