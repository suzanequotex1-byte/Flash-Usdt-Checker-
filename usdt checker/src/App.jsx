body, html, #root {
  margin: 0; padding: 0; height: 100%; background: #121212;
  font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center;
  color: #E0E0E0;
}

.app { display: flex; align-items: center; justify-content: center; width: 100%; }

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.7);
}

.title { font-size: 2rem; font-weight: bold; color: #FACC15; margin-bottom: 0.5rem; }
.subtitle { font-size: 1rem; color: #CCC; margin-bottom: 2rem; }

.verify-btn {
  padding: 1rem 2rem; border-radius: 9999px; font-weight: 600; background: #FACC15;
  color: #121212; border: none; cursor: pointer; z-index: 10;
  transition: transform 0.2s ease, background 0.3s ease;
}
.verify-btn:hover { transform: scale(1.05); background: #fbbf24; }
.verify-btn:disabled { background: #9ca3af; cursor: not-allowed; }

.pulse-wrapper {
  position: relative; display: flex; justify-content: center; align-items: center;
  width: 180px; height: 180px; margin: 0 auto 1.5rem auto;
}
.pulse-ring {
  position: absolute; border: 2px solid #FACC15; border-radius: 50%;
  width: 160px; height: 160px; animation: pulse 2.5s infinite;
}
.pulse-ring:nth-child(1) { animation-delay: 0s; }
.pulse-ring:nth-child(2) { animation-delay: 0.8s; }
.pulse-ring:nth-child(3) { animation-delay: 1.6s; }

@keyframes pulse {
  0% { transform: scale(0.6); opacity: 0.7; }
  70% { transform: scale(1.3); opacity: 0; }
  100% { opacity: 0; }
}

.status { margin-top: 1rem; font-size: 1rem; color: #FACC15; min-height: 24px; }
.spinner {
  width: 20px; height: 20px; border: 3px solid rgba(0,0,0,0.3);
  border-top: 3px solid #121212; border-radius: 50%; display: inline-block;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
