// components/StartButton.tsx
import { useStartGame } from "../services/useStartGame";
import startButton from "./assets/start_button.png";

export default function StartButton() {
  const { animateOnce, isFlashing, handleStart } = useStartGame();

  return (
    <section className="flex-grow flex flex-col justify-end items-center bg-black/55 pb-12">
      <img
        src={startButton}
        alt="Start Game"
        className={`${animateOnce ? "btn-drop" : ""} ${isFlashing ? "btn-flash" : ""}`}
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
  );
}
