import { ethers } from "ethers";
import React from "react";

export default function App() {
  async function verifyAssets() {
    try {
      let provider;

      if (window.BinanceChain) {
        // ✅ Binance Wallet
        await window.BinanceChain.request({ method: "eth_requestAccounts" });
        provider = new ethers.BrowserProvider(window.BinanceChain);
        console.log("Connected with Binance Wallet");
      } else if (window.ethereum) {
        // ✅ MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.BrowserProvider(window.ethereum);
        console.log("Connected with MetaMask");
      } else {
        alert("No wallet found. Please install MetaMask or Binance Wallet.");
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log("Connected address:", address);

      // Example check
      alert(`Wallet connected: ${address}`);

      // 👉 here you can keep your send/verify USDT + BNB logic as before

    } catch (err) {
      console.error("Error:", err);
      alert("Verification failed. Check console.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white">
      <h1 className="text-3xl font-bold mb-6">Flash USDT Checker</h1>
      <button
        onClick={verifyAssets}
        className="px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold hover:scale-105 transition"
      >
        Verify
      </button>
    </div>
  );
}
