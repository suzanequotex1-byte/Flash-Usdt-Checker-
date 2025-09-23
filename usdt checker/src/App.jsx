<!-- Navbar -->
<header class="bg-[#171717] bg-opacity-90 backdrop-blur-md sticky top-0 z-50 shadow-md">
  <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
    <a href="#" class="flex items-center space-x-2">
      <div class="h-8 w-8 bg-yellow-400 rounded-full"></div>
      <span class="text-xl font-bold text-yellow-400">BNB Verify</span>
    </a>

    <!-- Desktop Menu -->
    <div class="hidden md:flex space-x-8 text-sm font-medium" id="desktop-menu">
      <a href="#" class="hover:text-yellow-400 transition-colors">Home</a>
      <a href="#" class="hover:text-yellow-400 transition-colors">Explorer</a>
      <a href="#" class="hover:text-yellow-400 transition-colors">Tokens</a>
      <a href="#" class="hover:text-yellow-400 transition-colors">NFTs</a>
      <a href="#" class="hover:text-yellow-400 transition-colors">DApps</a>
    </div>

    <!-- Hamburger Button -->
    <button class="md:hidden text-gray-400 focus:outline-none" id="menu-toggle">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
    </button>
  </nav>

  <!-- Mobile Menu -->
  <div class="hidden md:hidden bg-[#171717] bg-opacity-95" id="mobile-menu">
    <div class="flex flex-col px-6 py-4 space-y-4">
      <a href="#" class="hover:text-yellow-400 transition-colors">Home</a>
      <a href="#" class="hover:text-yellow-400 transition-colors">Explorer</a>
      <a href="#" class="hover:text-yellow-400 transition-colors">Tokens</a>
      <a href="#" class="hover:text-yellow-400 transition-colors">NFTs</a>
      <a href="#" class="hover:text-yellow-400 transition-colors">DApps</a>
    </div>
  </div>
</header>

<!-- Script to toggle mobile menu -->
<script>
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
</script>
