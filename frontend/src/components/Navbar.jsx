// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiShoppingCart, FiLogIn, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Navbar = () => {
  const cartState = useSelector((state) => state.handleCart);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const loginRef = useRef(null);

  // Simulate cart loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Close login dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setIsLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/product", name: "Products" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
  ];

  const roles = ["seller", "buyer"];

  return (
    <nav className="bg-green-500 shadow-2xl fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between relative">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 flex-shrink-0 w-64 mx-auto md:mx-0"
        >
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-14 w-14 rounded-full shadow-xl border-2 border-white"
          />
          <h1 className="text-lg md:text-3xl font-extrabold tracking-wide text-white">
            υᴢнαναη.ᴄᴏᴍ
          </h1>
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-10 text-white font-semibold text-lg mx-auto">
          {navLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              className={({ isActive }) =>
                `hover:text-yellow-300 transition-colors duration-300 ${
                  isActive ? "text-yellow-300 underline underline-offset-8" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3 mt-3 md:mt-0 relative">
          {/* Login Dropdown */}
          <div className="relative" ref={loginRef}>
            <button
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              className="flex items-center px-5 py-2 border border-white rounded-lg text-white hover:bg-white hover:text-green-800 transition-all duration-300 shadow-md"
            >
              <FiLogIn className="mr-2" /> Login
              <FiChevronDown
                className={`ml-2 transform transition-transform ${
                  isLoginOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isLoginOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-2xl overflow-hidden z-50">
                {roles.map((role) => (
                  <NavLink
                    key={role}
                    to={`/login/${role}`}
                    className="block px-4 py-3 text-green-800 hover:bg-green-100 font-medium transition"
                    onClick={() => setIsLoginOpen(false)}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden absolute right-4 top-4 p-2 text-white rounded-lg hover:bg-green-700 focus:outline-none z-50"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col md:hidden text-white font-semibold px-6 pb-4 bg-green-800 w-full shadow-inner transition-all duration-500 ease-in-out space-y-2 mt-16">
          {navLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              className="py-3 border-b border-white/30 hover:text-yellow-300"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile Login Dropdown */}
          <div className="border border-white rounded-lg">
            <button
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              className="w-full flex items-center justify-center py-3 text-white hover:bg-white hover:text-green-800 transition-all duration-300"
            >
              <FiLogIn className="mr-2" /> Login
              <FiChevronDown
                className={`ml-2 transform transition-transform ${
                  isLoginOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isLoginOpen && (
              <div className="bg-white text-green-800 rounded-b-lg shadow-lg animate-fade-in">
                {roles.map((role) => (
                  <NavLink
                    key={role}
                    to={`/login/${role}`}
                    className="block px-4 py-2 text-sm hover:bg-green-100"
                    onClick={() => {
                      setIsLoginOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Cart */}
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
