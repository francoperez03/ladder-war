import { useEffect, useState } from "react";
import "./App.css";

import bg from "./assets/background.png";
import music from "./assets/music.mp3";
import startButton from "./assets/start_button.png";

export default function App() {
  const [animateOnce, setAnimateOnce] = useState(true);

  useEffect(() => {
    const audio = new Audio(music);
    audio.loop = true;
    audio.volume = 0.8;
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateOnce(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

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
            marginLeft: "35rem",
            marginRight: "auto",
            width: "280px",
          }}
          onClick={() => {
            console.log("Start clicked");
          }}
        />
      </section>
    </main>
  );
}
