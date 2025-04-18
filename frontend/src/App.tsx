import { useEffect, useRef, useState } from "react";
import "./App.css";

import bg from "./assets/background.png";
import music from "./assets/music.mp3";
import startButton from "./assets/start_button.png";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [animateOnce, setAnimateOnce] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(music);
    audio.loop = true;
    audio.volume = 0.8;
    audioRef.current = audio;
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateOnce(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  const handleStart = () => {
    audioRef.current?.play().catch(console.error);
    console.log("Start clicked");
    navigate("/select");
  };

  return (
    <main
      className="w-screen h-[100svh] flex flex-col"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "auto 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "black",
      }}
    >
      <section className="flex-grow flex flex-col justify-end items-center bg-black/55 pb-12">
        <img
          src={startButton}
          alt="Start Game"
          className={animateOnce ? "btn-drop" : ""}
          style={{
            marginTop: "40rem",
            marginBottom: "10rem",
            marginLeft: "40%",
            marginRight: "auto",
            maxWidth: "280px",
            maxHeight: "100px",
            objectFit: "contain",
          }}
          onClick={handleStart}
        />
      </section>
    </main>
  );
}
