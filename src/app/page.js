"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Fireworks from "../components/Fireworks";
import { useState, useEffect, useRef } from "react";

async function checkPlayPauseStatus() {
  try {
    const response = await fetch("api/spotify", { method: "GET" });
    if (response.ok) {
      const data = await response.json();
      return data.status;
    }
  } catch (error) {
    console.error("Error checking status:", error);
  }
}

export default function Home() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const playPauseRef = useRef(false);

  const startFireworks = () => {
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const play_status = await checkPlayPauseStatus();
      if (play_status !== playPauseRef.current) {
        playPauseRef.current = play_status;
        handlePlayPause();
        startFireworks();
      }
    }, 5000);

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
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center flex-col">
            <h1 className="text-5xl font-bold">
              Welcome,{" "}
              {status === "authenticated"
                ? session.user.name || "friend"
                : "stranger"}
              !
            </h1>
            {status === "loading" ? (
              <p>Loading...</p>
            ) : session ? (
              <div className="flex items-center flex-col">
                <br />
                <button
                  className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
                <br />
                <button
                  className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handlePlayPause()}
                >
                  Play/Pause
                </button>
              </div>
            ) : (
              <button
                className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => signIn("spotify")}
              >
                Sign in with Spotify
              </button>
            )}
            <Fireworks show={show} />
          </div>
        </div>
      </div>
    </main>
  );
}
