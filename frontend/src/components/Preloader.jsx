import React, { useEffect, useState } from "react";

const Preloader = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [show, setShow] = useState(true);
  const [zoomOut, setZoomOut] = useState(false);

  useEffect(() => {
    // Start zoom-out animation
    setZoomOut(true);

    // Start fade-out after 2.5s
    const fadeTimer = setTimeout(() => setFadeOut(true), 2500);

    // Remove preloader after fade (3.5s total)
    const removeTimer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, 3500);

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

      {/* Logo Zoom-out */}
      <img
        src="/assets/IMG-20251006-WA0016(1) (1).jpg"
        alt="Loading..."
        className={`relative z-10 w-44 h-44 object-cover rounded-full shadow-2xl transition-transform duration-[2000ms] ease-out ${
          zoomOut ? "scale-100" : "scale-150"
        }`}
      />

      {/* Dots Loader */}
      <div className="relative z-10 flex mt-6 space-x-3">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>

      {/* Animations */}
      <style>
        {`
          /* Dots styling */
          .dot {
            width: 14px;
            height: 14px;
            background-color: white;
            border-radius: 50%;
            opacity: 0.8;
            animation: bounce 1.4s infinite ease-in-out both;
          }

          .dot1 { animation-delay: -0.32s; }
          .dot2 { animation-delay: -0.16s; }

          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default Preloader;
