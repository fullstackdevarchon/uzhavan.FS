// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiShoppingCart, FiUserPlus, FiLogIn, FiMenu, FiX } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Navbar = () => {
  const cartState = useSelector((state) => state.handleCart);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="bg-green-500 shadow-2xl fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between relative">

        {/* Left: Logo + Title */}
        <NavLink to="/" className="flex items-center gap-3 flex-shrink-0 w-64 mx-auto md:mx-0">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-14 w-14 rounded-full shadow-xl border-2 border-white"
          />
          <h1 className="text-lg md:text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-white">
            υᴢнαναη.ᴄᴏᴍ
          </h1>
        </NavLink>

        {/* Center: Nav links (Desktop only) */}
        <div className="hidden md:flex gap-10 text-white font-semibold text-lg mx-auto">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition-colors duration-300 ${
                isActive ? "text-yellow-300 underline underline-offset-8" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/product"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition-colors duration-300 ${
                isActive ? "text-yellow-300 underline underline-offset-8" : ""
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition-colors duration-300 ${
                isActive ? "text-yellow-300 underline underline-offset-8" : ""
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition-colors duration-300 ${
                isActive ? "text-yellow-300 underline underline-offset-8" : ""
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Right: Buttons (Desktop only) */}
        <div className="hidden md:flex items-center space-x-3 mt-3 md:mt-0">
          <NavLink
            to="/login"
            className="flex items-center px-5 py-2 border border-white rounded-lg text-white hover:bg-white hover:text-green-800 transition-all duration-300 shadow-md"
          >
            <FiLogIn className="mr-2" /> Login
          </NavLink>
          <NavLink
            to="/register"
            className="flex items-center px-5 py-2 border border-white rounded-lg text-white hover:bg-white hover:text-green-800 transition-all duration-300 shadow-md"
          >
            <FiUserPlus className="mr-2" /> Register
          </NavLink>
          <NavLink
            to="/cart"
            className="flex items-center px-5 py-2 border border-white rounded-lg text-white hover:bg-white hover:text-green-800 transition-all duration-300 shadow-md"
          >
            <FiShoppingCart className="mr-2" />
            {loading ? (
              <Skeleton width={40} height={20} baseColor="#cbd5e1" />
            ) : (
              <>Cart ({cartState.length})</>
            )}
          </NavLink>
        </div>

        {/* Mobile menu toggle (Top-right corner) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden absolute right-4 top-4 p-2 text-white rounded-lg hover:bg-green-700 focus:outline-none z-50"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile nav links + login/register/cart */}
      {isOpen && (
        <div className="flex flex-col md:hidden text-white font-semibold px-6 pb-4 bg-green-800 w-full shadow-inner transition-all duration-500 ease-in-out space-y-2 mt-16">
          <NavLink
            to="/"
            className="py-3 border-b border-white/30 hover:text-yellow-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/product"
            className="py-3 border-b border-white/30 hover:text-yellow-300"
            onClick={() => setIsOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className="py-3 border-b border-white/30 hover:text-yellow-300"
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="py-3 border-b border-white/30 hover:text-yellow-300"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </NavLink>

          {/* Mobile Buttons */}
          <NavLink
            to="/login"
            className="flex items-center justify-center py-3 border border-white rounded-lg hover:bg-white hover:text-green-800 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <FiLogIn className="mr-2" /> Login
          </NavLink>
          <NavLink
            to="/register"
            className="flex items-center justify-center py-3 border border-white rounded-lg hover:bg-white hover:text-green-800 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <FiUserPlus className="mr-2" /> Register
          </NavLink>
          <NavLink
            to="/cart"
            className="flex items-center justify-center py-3 border border-white rounded-lg hover:bg-white hover:text-green-800 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <FiShoppingCart className="mr-2" />
            {loading ? (
              <Skeleton width={40} height={20} baseColor="#cbd5e1" />
            ) : (
              <>Cart ({cartState.length})</>
            )}
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
