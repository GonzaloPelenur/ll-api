"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Fireworks from "../components/Fireworks";
import OverlayGIF from "@/components/OverlayGIF";
import { useState, useEffect, useRef } from "react";

async function checkPlayPauseStatus() {
  try {
    const response = await fetch("api/spotify", { method: "GET" });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error checking status:", error);
  }
}

export default function Home() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [musicGIFVisible, setMusicGIFVisible] = useState(false);
  const [capybaraGIFVisible, setCapybaraGIFVisible] = useState(false);
  const [dinostopGIFVisible, setDinostopGIFVisible] = useState(false);
  const [glassGIFVisible, setGlassGIFVisible] = useState(false);
  const playPauseRef = useRef(false);
  const songIdRed = useRef("");

  const musicGIF = "/music.gif";
  const capybaraGIF = "/capybaragreen.gif";
  const dinostopGIF = "/dinostopnbg.gif";
  const glassGIF = "/glass.gif";

  const startGlassGIF = () => {
    setGlassGIFVisible(true);
    setTimeout(() => setGlassGIFVisible(false), 2000);
  };
  const startDinostopGIF = () => {
    setDinostopGIFVisible(true);
    setTimeout(() => setDinostopGIFVisible(false), 3000);
  };

  const startCapybaraGIF = () => {
    setCapybaraGIFVisible(true);
    setTimeout(() => setCapybaraGIFVisible(false), 6000);
  };

  const startMusicGIF = () => {
    setMusicGIFVisible(true);
    setTimeout(() => setMusicGIFVisible(false), 5000);
  };
  const startFireworks = () => {
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const data = await checkPlayPauseStatus();
      console.log("data", data);
      const play_status = data.status;
      const song_id = data.song;
      const action = data.action;
      if (action === "change" && song_id !== songIdRed.current) {
        console.log("change song", song_id);
        songIdRed.current = song_id;
        change_song(song_id);
        startMusicGIF();
        // startFireworks();
      }
      if (action === "play_pause" && play_status !== playPauseRef.current) {
        playPauseRef.current = play_status;
        if (play_status) {
          console.log("play");
          startCapybaraGIF();
        } else {
          console.log("pause");
          startDinostopGIF();
        }
        handlePlayPause();
        // startFireworks();
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, []);
  async function getCurrentlyPlaying() {
    let token = session.user.accessToken;
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response", response);
    if (response.status == 204) {
      console.log("204 response from currently playing");
      return;
    }
    const data = await response.json();
    return data;
  }
  async function change_song(song_id) {
    let token = session.user.accessToken;
    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      body: JSON.stringify({
        uris: [`spotify:track:${song_id}`],
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("play/pause", response);
  }
  async function handlePlayPause() {
    const currentlyPlayingData = await getCurrentlyPlaying();
    if (currentlyPlayingData) {
      if (currentlyPlayingData.is_playing) {
        let token = session.user.accessToken;
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/pause",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("play/pause", response);

        // if (response.status == 204) {
        //     setGlobalIsTrackPlaying(false)
        // }
      } else {
        let token = session.user.accessToken;
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/play",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("play/pause", response);

        // if (response.status == 204) {
        //     setGlobalIsTrackPlaying(true)
        // }
      }
    } else {
      console.log("no currently playing data");
      let token = session.user.accessToken;
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/devices",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("play/pause", data);
      const devices = data.devices;
      if (devices.length == 0) {
        console.log("No devices found");
        return;
      }
      const response2 = await fetch(
        "https://api.spotify.com/v1/me/player/player",
        {
          method: "PUT",
          body: JSON.stringify({
            device_ids: [devices[0].id],
            play: true,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  }
  const handleSpotify = async () => {
    if (!session) {
      signIn("spotify"); // Sign in using Spotify if not signed in
    } else {
      await spotify();
      // Optionally start fireworks here if needed
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full flex flex-col lg:flex-row">
        {/* Sign in/out button at the top left, small and less noticeable */}
        <div className="flex items-start justify-start w-full lg:w-auto">
          {status === "loading" ? (
            <p>Loading...</p>
          ) : session ? (
            <button
              className="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded opacity-75"
              onClick={() => signOut()}
              style={{ position: "absolute", top: 0, left: 0, zIndex: 50 }}
            >
              Sign out
            </button>
          ) : (
            <button
              className="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded opacity-75"
              onClick={() => signIn("spotify")}
              style={{ position: "absolute", top: 0, left: 0, zIndex: 50 }}
            >
              Sign in
            </button>
          )}
        </div>

        <div className="flex flex-col items-center justify-between w-full">
          <div className="flex items-center flex-col">
            {/* Fireworks and GIFs can still be central or as needed */}
            <Fireworks show={show} />
            <OverlayGIF gifPath={musicGIF} isVisible={musicGIFVisible} />
            <OverlayGIF gifPath={capybaraGIF} isVisible={capybaraGIFVisible} />
            <OverlayGIF gifPath={dinostopGIF} isVisible={dinostopGIFVisible} />
            <OverlayGIF gifPath={glassGIF} isVisible={glassGIFVisible} />
          </div>
        </div>
      </div>
    </main>
  );
}
