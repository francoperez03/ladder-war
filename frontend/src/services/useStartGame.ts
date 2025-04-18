// services/useStartGame.ts
import { useEffect, useRef, useState } from "react";
import music from "../components/assets/music.mp3";
import { useNavigate } from "react-router-dom";
import { PXEFactory } from "../factories/PXEFactory";
import { getDeployedTestAccountsWallets } from "@aztec/accounts/testing";
import { Contract, Wallet } from "@aztec/aztec.js";
import { TokenContractArtifact } from "../artifacts/Token";

const deployedAddress = "0x..."; // poné acá la address real

export function useStartGame() {
  const [animateOnce, setAnimateOnce] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
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

  useEffect(() => {
    const connectToPXE = async () => {
      try {
        const pxe = await PXEFactory.getPXEInstance();
        const wallets = await getDeployedTestAccountsWallets(pxe);
        setWallet(wallets[0]);
      } catch (err) {
        console.error("Error connecting to PXE:", err);
      }
    };
    connectToPXE();
  }, []);

  const flashAndNavigate = async () => {
    setIsFlashing(true);
    await new Promise((res) => setTimeout(res, 500));
    setIsFlashing(false);
    await new Promise((res) => setTimeout(res, 500));
    setIsFlashing(true);
    await new Promise((res) => setTimeout(res, 500));
    setIsFlashing(false);
  };

  const handleStart = async () => {
    try {
      audioRef.current?.play().catch(console.error);
      await flashAndNavigate();

      if (!wallet) throw new Error("Wallet not loaded");

      const contract = await Contract.at(deployedAddress, TokenContractArtifact, wallet);
      await contract.methods.start_game().send().wait();

      navigate("/waiting-room");
    } catch (err) {
      console.error("Error during start:", err);
    }
  };

  return {
    animateOnce,
    isFlashing,
    handleStart,
  };
}
