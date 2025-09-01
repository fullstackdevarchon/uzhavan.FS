// src/components/Footer.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FiShoppingCart, FiUserPlus, FiLogIn } from "react-icons/fi";

const Footer = () => {
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Products", to: "/product" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
    // { name: "Login", to: "/login", icon: <FiLogIn className="inline mr-1" /> },
    // { name: "Register", to: "/register", icon: <FiUserPlus className="inline mr-1" /> },
    { name: "Cart", to: "/cart", icon: <FiShoppingCart className="inline mr-1" /> },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="container mx-auto px-6 lg:px-12 text-center">

        {/* Logo / Brand */}
        <NavLink to="/" className="text-2xl font-bold text-white mb-4 inline-block">
          υᴢнαναη.ᴄᴏᴍ
        </NavLink>

        {/* Nav Links */}
        <div className="flex justify-center gap-6 mt-4 flex-wrap text-lg font-semibold">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `hover:text-yellow-300 transition-colors duration-300 ${
                  isActive ? "text-yellow-300 underline underline-offset-4" : ""
                }`
              }
            >
              {link.icon && link.icon} {link.name}
            </NavLink>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-6 text-xl">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaInstagram />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaYoutube />
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaWhatsapp />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400 mt-6">
          © {new Date().getFullYear()} Archon Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
