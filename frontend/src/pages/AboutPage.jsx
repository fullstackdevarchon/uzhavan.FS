// src/pages/AboutPage.jsx
import React from "react";
import { FaLeaf, FaUsers, FaSeedling, FaClock } from "react-icons/fa";
import PageContainer from "../components/PageContainer";
import Footer from "../components/Footer";

const AboutPage = () => {
  const productCategories = [
    {
      title: "Fruits",
      img: "https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,h_450,q_auto,w_710/f_auto/wip--21-healthiest-fruits-to-eat-in-2024-php3RGRfc",
      description: "Fresh, handpicked fruits grown naturally by trusted farmers.",
    },
    {
      title: "Vegetables",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgdqdu7X6uYyea_gKvcurHp6JmbclQOm-8EB_XJbOuydzmfaoeh7jzxF4_MUqTRkUxHDE&usqp=CAU",
      description:
        "Green, healthy vegetables ensuring nutrition and daily well-being.",
    },
    {
      title: "Spices",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe4O51eBTIq4I6-lO-Ka-AHxof4uUG8EWTnQ&s",
      description:
        "Authentic Kerala spices that deliver purity, aroma, and true flavor.",
    },
  ];

  return (
    <PageContainer>
      <main
        className="min-h-screen bg-cover bg-center bg-fixed text-white"
        style={{
          backgroundImage: `url('/assets/IMG-20251013-WA0000.jpg')`,
        }}
      >
        <div className="bg-black/60 min-h-screen py-16 px-4">

          {/* ------------------------------------------------ */}
          {/* 1. ABOUT COMPANY FIRST */}
          {/* ------------------------------------------------ */}
          <section className="max-w-4xl mx-auto mb-20 bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl animate-fadeIn">

            <h1 className="text-5xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-white drop-shadow-xl">
              About Our Company
            </h1>

            <p className="text-lg leading-relaxed text-gray-200 font-medium">
              Born from the heart of Kerala's spice valleys,{" "}
              <span className="font-bold text-green-300">
                Terravale Ventures LLP
              </span>{" "}
              is more than a company — it is a bridge between tradition and the
              global market.
              <br />
              <br />
              We bring the fragrance of Idukki’s cardamom and the purity of our
              farmers' hard work to homes around the world. Our mission is to
              empower every farmer while delivering premium, naturally produced
              goods across international markets.
              <br />
              <br />
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/* MISSION & VISION SECTION */}
          {/* ------------------------------------------------ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-20 animate-fadeIn">
            {/* Vision */}
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-3xl transition-all">
              <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
                <FaLeaf className="text-green-300" /> Vision
              </h2>
              <p className="text-gray-200 leading-relaxed text-lg">
                To make the world experience the true essence of Kerala's spices
                while empowering every farmer who nurtures them.
                We dream of building a legacy rooted in purity, prosperity and purpose.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-3xl transition-all">
              <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
                <FaSeedling className="text-green-300" /> Mission
              </h2>
              <p className="text-gray-200 leading-relaxed text-lg">
                To connect Indian farmers directly to global markets,
                ensuring fair pricing and uncompromised quality.
                We blend tradition with modern innovation to uplift rural India.
              </p>
            </div>
          </section>

          {/* ------------------------------------------------ */}
          {/* OUR FARMERS SECTION */}
          {/* ------------------------------------------------ */}
          <section className="max-w-4xl mx-auto mb-20 bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-xl animate-fadeIn">
            <h2 className="text-4xl font-bold text-center mb-6 flex items-center justify-center gap-3">
              <FaUsers className="text-green-300" /> Nutriest People Around Us
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed text-center">
              Our farmers are the backbone of Terravale.
              Their strength and dedication give meaning to every shipment we send.
              They’re not suppliers — they are our family.
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/* TITLE - OUR CATEGORIES */}
          {/* ------------------------------------------------ */}
          <h2 className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-green-400 drop-shadow-xl animate-fadeIn">
            Our Categories
          </h2>

          {/* ------------------------------------------------ */}
          {/* CATEGORIES GRID */}
          {/* ------------------------------------------------ */}
          <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-20 animate-fadeIn">

            {productCategories.map((category, idx) => (
              <div
                key={idx}
                className="
                  bg-white/10 border border-white/20 rounded-3xl
                  backdrop-blur-xl shadow-xl hover:shadow-3xl
                  transition-all duration-500 hover:scale-[1.04]
                  overflow-hidden
                "
              >

                {/* IMAGE ONLY (ICON REMOVED) */}
                <div className="overflow-hidden">
                  <img
                    src={category.img}
                    alt={category.title}
                    className="w-full h-64 object-cover transition duration-500 hover:scale-110"
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-200 text-base leading-relaxed">
                    {category.description}
                  </p>
                </div>

              </div>
            ))}
          </section>

        </div>
      </main>
      <Footer />
    </PageContainer>
  );
};

export default AboutPage;
