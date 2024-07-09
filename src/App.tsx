import React, { useEffect, useRef, useState } from "react";
import { getRefreshToken, redirectToAuthCodeFlow, getAccessToken } from "./auth/auth";
import { getYtVideos } from "./YoutubeAPI";
import ReactPlayer from 'react-player'


const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const SpotifyProfile: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token") || null
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [playlistId, setPlaylistId] = useState<string>('');
  const [tracks, setTracks] = useState<any | null>();
  const initialRender = useRef(true);


  useEffect(() => {
    const fetchProfile = async (token: string) => {
      try {
        const result = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!result.ok) {
          if (result.status === 401) {
            await getRefreshToken();
          } else {
            throw new Error(`Failed to fetch profile: ${result.status} ${result.statusText}`);
          }
        }

        const profileData = await result.json();
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Optionally handle error states, e.g., redirect to re-authenticate
      }
    };

    const initialize = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (accessToken) {
        // Token exists in localStorage, fetch profile
        fetchProfile(accessToken);
      } else if (code) {
        // Code exists in URL query params, exchange for token
        try {
          const token = await getAccessToken(clientId, code);
          setAccessToken(token);
          fetchProfile(token);
        } catch (error) {
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

  const handlePlaylistSubmit = async (e: any) => {
    e.preventDefault();
    if (!accessToken) return;
  
    try {
      const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!result.ok) {
        throw new Error(`Failed to fetch playlist: ${result.status} ${result.statusText}`);
      }
      const playlistData = await result.json();
      setTracks(playlistData.tracks); // Update tracks state
    } catch (error) {
      console.error('Error fetching playlist:', error);
      // Optionally handle error states
    }
  };

  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);

  
  useEffect(() => {
    // Skip initial render effect
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    handleNextSong();
  }, [tracks]);

  const handleNextSong = () => {
    const length = tracks.items.length;
    const index = Math.floor(Math.random() * length);
    const songName = tracks.items[index].track.name;
    const artistName = tracks.items[index].track.artists[0].name;
    const query = songName + " by " + artistName;
    console.log("Song name: " + songName);
    console.log("Artist name: " + artistName);
    console.log(query);
    getYtVideos(query).then((data) => { getYoutubeLink(data, songName, artistName) }).catch();
  };

  const getYoutubeLink = (videos: any[], songName: string, artistName: string) => {
    console.log(videos);
    setSongInfo({name: songName, artist: artistName,  youtube_link:`https://youtube.com/watch?v=${videos[0].videoId}`, preview_url: ''})
  }
 
  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="flex flex-col justify-center items-center gap-3">
        <h1>Spotify Profile</h1>
        <div>
          <strong>Name: </strong>
          <span id="displayName">{profile.display_name}</span>
        </div>
        <div>
          {profile.images && profile.images.length > 0 && (
            <img id="avatar" src={profile.images[0].url} className="w-32 h-32" alt="avatar" />
          )}
        </div>
        <div>
          <strong>ID: </strong>
          <span id="id">{profile.id}</span>
        </div>
        <div>
          <strong>Email: </strong>
          <span id="email">{profile.email}</span>
        </div>
        <div>
          <strong>URI: </strong>
          <a id="uri" href={profile.external_urls.spotify}>
            {profile.uri}
          </a>
        </div>
        <div>
          <strong>URL: </strong>
          <a id="url" href={profile.href}>
            {profile.href}
          </a>
        </div>
        <div>
          <strong>Image URL: </strong>
          {profile.images && profile.images.length > 0 && (
            <span id="imgUrl">{profile.images[0].url}</span>
          )}
        </div>

        <div className="flex flex-col justify-center items-center py-4 gap-5">
          <h2 className="text-2xl">Fetch Playlist</h2>
          <form onSubmit={handlePlaylistSubmit} className="flex flex-col justify-center items-center gap-3">
              <span className="text-xl">Playlist Id:</span>
              <input
                type="text"
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
                required
                className="w-96 h-full text-center bg-white text-black"
                placeholder="Playlist Id"
              />
            <button type="submit">Fetch Playlist</button>
          </form>
        </div>
        {songInfo  && (
          <div className="flex w-full h-full flex-col items-center justify-center gap-10 text-center my-3 " key={1}>
            <div className="flex flex-col gap-3"> 
              <h1>{songInfo.name}</h1>
              <p>{songInfo.youtube_link}</p>
              <p>{songInfo.preview_url}</p>
              <p>{songInfo.artist}</p>
            </div>
            <ReactPlayer playing={true} controls={true} url={songInfo.youtube_link}/>
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
