// src/components/Footer.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

const Footer = () => {
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Products", to: "/product" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
    { 
      name: "Cart", 
      to: "/cart", 
      icon: <FiShoppingCart className="inline-block mr-1" /> 
    },
  ];

  return (
    <footer className="w-full bg-white/5 backdrop-blur-xl border-t border-white/20 mt-20 py-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">

        {/* Brand Name */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide drop-shadow mb-4">
          Terravale Ventures LLP
        </h2>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 mt-4 text-lg font-semibold">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `
                transition-all duration-300 px-3 py-1 rounded-md
                ${
                  isActive
                    ? "text-[#8FE3A2] underline underline-offset-4 decoration-[rgba(27,60,43,0.9)]"
                    : "text-[#C7DAD1] hover:text-white hover:bg-[rgba(27,60,43,0.6)]"
                }
                `
              }
            >
              {link.icon} {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex justify-center gap-5 mt-8 text-xl">
          {[FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp].map((Icon, i) => (
            <a
              key={i}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-[#C7DAD1]
                p-3 rounded-full 
                transition-all duration-300
                hover:text-white 
                hover:bg-[rgba(27,60,43,0.6)]
                hover:scale-110
              "
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-white/20 mt-10"></div>

        {/* Copyright */}
        <p className="text-[#C7DAD1] text-sm mt-6 tracking-wide">
          © {new Date().getFullYear()} Terravale Ventures LLP. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
