import "./App.css";
import bg from "./assets/background.png";
import StartButton from "./components/StartButton";

export default function App() {
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
      <StartButton />
    </main>
  );
}
