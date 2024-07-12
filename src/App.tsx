import React, { useEffect, useRef, useState } from "react";
import { redirectToAuthCodeFlow, getAccessToken, getRefreshToken } from "./auth/auth";
import { getYtVideos } from "./YoutubeAPI";
import ReactPlayer from 'react-player';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const SpotifyProfile: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token") || null
  );
  const [playListLink, setPlayListLink] = useState<string>('');
  const [tracks, setTracks] = useState<any[]>([]);
  const initialRender = useRef(true);
  const [songInfo, setSongInfo] = useState<{ name: string, artist: string, youtube_link: string, preview_url: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log(result);
      } catch (error) {
        await getRefreshToken();
        location.reload();
      }
    };

    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  useEffect(() => {
    const initialize = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      
      if (accessToken) {
        // Token exists in localStorage, fetch profile
      } else if (code) {
        try {
          const token = await getAccessToken(clientId, code);
          setAccessToken(token);
          window.location.reload(); // Reload after getting the access token
        } catch (error) {
          await getRefreshToken();
          window.location.reload(); // Reload after getting the access token
          console.error("Error getting access token:", error);
        }
      } else {
        redirectToAuthCodeFlow(clientId);
      }
    };

    initialize();
  }, [accessToken]);

  const handlePlaylistSubmit = async (e?: React.FormEvent<HTMLFormElement>, retry = false) => {
    if (e) e.preventDefault();
    if (!accessToken) return;

    const playlistId = playListLink.split('/').pop();
    let allTracks: any[] = [];
    let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    try {
      while (nextUrl) {
        const result = await fetch(nextUrl, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!result.ok) {
          if (!retry) {
            await getRefreshToken();
            const newAccessToken = localStorage.getItem("access_token");
            if (newAccessToken) setAccessToken(newAccessToken);
            return handlePlaylistSubmit(e, true);
          } else {
            throw new Error(`Failed to fetch playlist: ${result.status} ${result.statusText}`);
          }
        }

        const playlistData = await result.json();
        allTracks = [...allTracks, ...playlistData.items];
        nextUrl = playlistData.next;
      }
      setTracks(allTracks);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    handleNextSong();
  }, [tracks]);

  const handleNextSong = () => {
    if (!tracks || tracks.length === 0) return;
    const index = Math.floor(Math.random() * tracks.length);
    const songName = tracks[index].track.name;
    const artistName = tracks[index].track.artists[0].name;
    const query = `${songName} by ${artistName}`;
    getYtVideos(query, songName, artistName).then(data => getYoutubeLink(data, songName, artistName)).catch(console.error);
  };

  const getYoutubeLink = (videos: any, songName: string, artistName: string) => {
    setSongInfo({
      name: songName,
      artist: artistName,
      youtube_link: `https://youtube.com/watch?v=${videos.videoId}`,
      preview_url: '',
    });
  };
  const handleDownload = async () => {
    if (!songInfo?.youtube_link) {
      return;
    }
    const response = await fetch(`https://yt-music-api-9ivk.onrender.com/api/download?url=${songInfo.youtube_link}`);
    
    if (!response.ok) {
        console.error('Failed to download video');
        return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video.mp4'; // You can set a different filename here
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="flex flex-col justify-center items-center gap-3">
        <div className="flex flex-col justify-center items-center py-4 gap-5">
          <h2 className="text-2xl">Fetch Playlist</h2>
          <form onSubmit={handlePlaylistSubmit} className="flex flex-col justify-center items-center gap-3">
            <span className="text-xl">Enter Playlist Link</span>
            <input
              type="text"
              value={playListLink}
              onChange={(e) => setPlayListLink(e.target.value)}
              required
              className="w-96 h-full text-center bg-white text-black"
              placeholder="Spotify Playlist Link"
            />
            <button type="submit">Fetch Playlist</button>
          </form>
        </div>
        {!songInfo && <div>Loading... It might take a while</div>}
        {songInfo && (
          <div className="flex w-full h-full flex-col items-center justify-center gap-10 text-center my-3">
            <div className="flex flex-col gap-3">
              <h1>{songInfo.name}</h1>
              <p>{songInfo.youtube_link}</p>
              <p>{songInfo.preview_url}</p>
              <p>{songInfo.artist}</p>
            </div>
            <ReactPlayer playing={true} controls={true} url={songInfo.youtube_link} />
          </div>
        )}
        <div>
          <button type="button" onClick={handleNextSong}>Next Song</button>
        </div>
        <div>
          <button type="submit" onClick={handleDownload}>Download MP3</button>
        </div>
      </div>
    </div>
  );
};

export default SpotifyProfile;
