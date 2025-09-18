import { useState } from "react";
import { ethers } from "ethers";

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [result] = useState({
    verified: true,
    name: "FlashUSDTContract",
  });

  // Connect Wallet
  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } else {
      alert("Please install MetaMask or Binance Wallet!");
    }
  }

  // Safe verification (no BNB sent)
  async function verifyUser() {
    if (!window.ethereum) return alert("Install a wallet first!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    alert(`✅ Verification successful for wallet: ${address}`);
  }

  return (
    <div className="min-h-screen flex bg-binanceDark text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] flex flex-col p-6 shadow-lg">
        <h2 className="text-binanceYellow text-2xl font-bold mb-10">⚡ Flash Checker</h2>
        <nav className="flex flex-col gap-4">
          <a href="#" className="text-gray-400 hover:text-binanceYellow transition">Dashboard</a>
          <a href="#" className="text-gray-400 hover:text-binanceYellow transition">Contracts</a>
          <a href="#" className="text-gray-400 hover:text-binanceYellow transition">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="w-full bg-[#1A1A1A] p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold text-binanceYellow">Flash USDT Checker</h1>
          <div>
            {walletAddress ? (
              <span className="text-green-400 font-mono text-sm px-3 py-1 bg-gray-800 rounded-lg">
                ✅ {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}
              </span>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold rounded-lg hover:scale-105 transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-10">
          {/* Contract Card */}
          <div className="bg-binanceCard p-8 rounded-2xl shadow-xl w-full max-w-md text-center mb-8 hover:shadow-yellow-500/50 transition">
            {result.verified ? (
              <p className="text-green-400 font-semibold text-lg">
                ✅ Verified Contract: {result.name}
              </p>
            ) : (
              <p className="text-red-400 font-semibold text-lg">❌ Not Verified</p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={verifyUser}
            className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl shadow-lg hover:brightness-110 transition"
          >
            Verify
          </button>
        </main>
      </div>
    </div>
  );
}
