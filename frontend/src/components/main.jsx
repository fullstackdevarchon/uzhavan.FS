// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Preloader from "./Preloader";
import { Link } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <section className="w-full min-h-screen font-poppins">

      {/* HERO SECTION */}
      <div
        className="
          flex items-center justify-center
          min-h-screen w-full
          bg-cover bg-center bg-no-repeat
          animate-zoomBg
        "
        style={{
          backgroundImage: "url('/assets/home-bg.jpg')",
        }}
      >
        {/* Soft Overlay (makes text readable) */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-white/20"></div>

        {/* CONTENT BLOCK */}
        <div
          className="
            relative z-10 container mx-auto px-6
            text-center md:text-left
            flex flex-col justify-center
            items-center md:items-start 
            py-28 md:py-36
            animate-fadeUp
          "
        >
          {/* TITLE */}
          <h1
            className="
              text-[#1C3F2C] 
              text-4xl sm:text-5xl lg:text-6xl 
              font-extrabold 
              mb-6 leading-tight tracking-wide 
              drop-shadow-lg
            "
          >
            Welcome to{" "}
            <span className="text-green-700">Terravale Ventures LLP</span>
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              text-gray-900 
              text-base sm:text-lg md:text-xl lg:text-2xl
              max-w-5xl leading-relaxed mb-10 
              drop-shadow
              font-light
              animate-fadeInSlow
            "
          >
            Terravale Ventures LLP connects farmers and customers directly —
            delivering fresh produce, authentic products, and trusted services.
            Explore the latest agricultural solutions, empowering communities
            for a sustainable tomorrow.
          </p>

          {/* BUTTON */}
          <Link to="/login">
            <button
              className="
                px-12 py-4 text-lg font-semibold 
                rounded-lg 
                bg-[linear-gradient(to_right,#182E6F,rgba(27,60,43,0.6))]
                text-white
                shadow-xl hover:shadow-2xl 
                transition-all duration-300 
                hover:scale-110
                backdrop-blur-md
              "
            >
              Explore Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
