import React, { useEffect, useRef, useState } from "react";
import { getRefreshToken, redirectToAuthCodeFlow, getAccessToken } from "./auth/auth";
import { getYtVideos } from "./YoutubeAPI";
import ReactPlayer from 'react-player';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const SpotifyProfile: React.FC = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [playListLink, setPlayListLink] = useState<string>('');
    const [tracks, setTracks] = useState<any | null>();
    const initialRender = useRef(true);
    const [songInfo, setSongInfo] = useState<SongInfo | null>(null);

    useEffect(() => {
        const initialize = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");

            if (accessToken) {
                // Token exists, fetch profile or other data
            } else if (code) {
                try {
                    const { access_token, refresh_token } = await getAccessToken(clientId, code);
                    setAccessToken(access_token);
                    setRefreshToken(refresh_token);
                } catch (error) {
                    console.error("Error getting access token:", error);
                    redirectToAuthCodeFlow(clientId);
                }
            } else {
                redirectToAuthCodeFlow(clientId);
            }
        };

        initialize();
    }, [accessToken]);

    const handlePlaylistSubmit = async (e?: any) => {
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
                    await refreshAccessToken();
                    return handlePlaylistSubmit(e);
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

    const refreshAccessToken = async () => {
        if (!refreshToken) return;
        try {
            const response = await getRefreshToken(clientId, refreshToken);
            setAccessToken(response.access_token);
            setRefreshToken(response.refresh_token);
        } catch (error) {
            console.error("Error refreshing token:", error);
            redirectToAuthCodeFlow(clientId);
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
        const query = `${songName} ${artistName}`;
        getYtVideos(query, songName, artistName).then(data => getYoutubeLink(data, songName, artistName)).catch(console.error);
    };

    const getYoutubeLink = (videos: any, songName: string, artistName: string) => {
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
                {!songInfo && <div>Loading... It might take a while</div>}
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
