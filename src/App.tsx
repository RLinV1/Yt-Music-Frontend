import React, { useEffect, useRef, useState } from "react";
import { getRefreshToken, redirectToAuthCodeFlow, getAccessToken } from "./auth/auth";
import { getYtVideos } from "./YoutubeAPI";
import ReactPlayer from 'react-player'


const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const SpotifyProfile: React.FC = () => {

  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token") || null
  );
  const [playListLink, setPlayListLink] = useState<string>('');
  const [tracks, setTracks] = useState<any | null>();
  const initialRender = useRef(true);
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);

  // calls the spotify api for the fetchProfile
  useEffect(() => {
    // intializes the access token and refresh token
    const initialize = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (accessToken) {
        // Token exists in localStorage, fetch profile
      } else if (code) {
        // Code exists in URL query params, exchange for token
        try {
          const token = await getAccessToken(clientId, code);
          setAccessToken(token);
        } catch (error) {
          await getRefreshToken();
          console.error("Error getting access token:", error);
          // Optionally handle error states
        }
      } else {
        // Neither token nor code exists, redirect to auth flow
        redirectToAuthCodeFlow(clientId);
      }
    };

    initialize();
  }, [accessToken]);

  // calls the spotify api based on the playlist id
  const handlePlaylistSubmit = async (e?: any, retry = false) => {
    if (e) e.preventDefault();
    if (!accessToken) return;

    const playlistId = playListLink.substring(playListLink.length - 22);
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
            return handlePlaylistSubmit(e, true); // Retry once after refreshing token
          } else {
            throw new Error(`Failed to fetch playlist: ${result.status} ${result.statusText}`);
          }
        }

        const playlistData = await result.json();
        allTracks = [...allTracks, ...playlistData.items];
        nextUrl = playlistData.next; // Set nextUrl to the next page URL, or null if there are no more pages
      }
      setTracks(allTracks); // Update tracks state with all fetched tracks
    } catch (error) {
      console.error('Error fetching playlist:', error);
      // Optionally handle error states
    }
  };

  // if tracks is intialized or changed then we can call the youtube api for videos
  useEffect(() => {
    // Skip initial render effect
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    handleNextSong();
  }, [tracks]);

  // picks a random song from the tracks to pick
  const handleNextSong = () => {
    if (!tracks || tracks.length === 0) return;
    const length = tracks.length;
    const index = Math.floor(Math.random() * length);
    const songName = tracks[index].track.name;
    const artistName = tracks[index].track.artists[0].name;
    const query = `${songName} ${artistName}`;
    console.log(query);
    getYtVideos(query, songName).then((data) => { getYoutubeLink(data, songName, artistName) }).catch();
  };

  const getYoutubeLink = (videos: any, songName: string, artistName: string) => {
    console.log(videos);
    setSongInfo({ name: songName, artist: artistName, youtube_link: `https://youtube.com/watch?v=${videos.videoId}`, preview_url: '' });
  }

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
        {!songInfo && (
          <div>Loading... It might take a while</div>
        )}
        {songInfo && (
          <div className="flex w-full h-full flex-col items-center justify-center gap-10 text-center my-3" key={1}>
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
          <button type="submit" onClick={handleNextSong}>Next Song</button>
        </div>
      </div>
    </div>
  );
};

export default SpotifyProfile;
