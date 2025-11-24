import React, { useEffect, useState } from "react";

const Preloader = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Start fade-out after 3s
    const fadeTimer = setTimeout(() => setFadeOut(true), 3000);

    // Remove preloader after fade (4s total)
    const removeTimer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish(); // call parent handler when done
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 z-[9999] ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundImage: "url('/assets/IMG-20251013-WA0000.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Loader Section */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Rotating glowing ring */}
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full border-8 border-t-amber-400 border-b-pink-500 border-l-blue-500 border-r-green-400 animate-spin-slow shadow-xl"></div>
          <img
            src="/assets/IMG-20251006-WA0016(1) (1).jpg"
            alt="Loading..."
            className="absolute inset-2 w-36 h-36 object-cover rounded-full border-4 border-white shadow-2xl"
          />
        </div>

        {/* Company name */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-[4px] animate-text-glow">
          Terravale Ventures LLP
        </h1>

        {/* Progress bar */}
        <div className="w-72 h-2 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 animate-progress"></div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 20px #00f, 0 0 40px #f0f, 0 0 60px #0ff; }
            50% { text-shadow: 0 0 10px #fff, 0 0 20px #0ff, 0 0 30px #f0f; }
          }

          .animate-progress {
            animation: progress 2s ease-in-out infinite;
          }

          .animate-text-glow {
            animation: textGlow 3s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Preloader;
