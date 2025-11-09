import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiLogIn,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Navbar = () => {
  const cartState = useSelector((state) => state.handleCart);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Separate dropdown states for desktop and mobile to avoid collisions
  const [isDesktopLoginOpen, setIsDesktopLoginOpen] = useState(false);
  const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false);

  // refs for outside click detection
  const desktopLoginRef = useRef(null);
  const mobileLoginRef = useRef(null);

  const navigate = useNavigate();

  // simulate cart loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // outside click for desktop login dropdown
  useEffect(() => {
    const handleClickOutsideDesktop = (e) => {
      if (
        desktopLoginRef.current &&
        !desktopLoginRef.current.contains(e.target)
      ) {
        setIsDesktopLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDesktop);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideDesktop);
  }, []);

  // outside click for mobile login dropdown
  useEffect(() => {
    const handleClickOutsideMobile = (e) => {
      if (mobileLoginRef.current && !mobileLoginRef.current.contains(e.target)) {
        setIsMobileLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMobile);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideMobile);
  }, []);

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/product", name: "Products" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
  ];

  const roles = ["seller", "buyer"];

  // helper used by mobile links to navigate and close menus reliably
  const handleMobileLoginNavigate = (role) => {
    setIsMobileLoginOpen(false);
    setIsOpen(false);
    // small microtask delay ensures state updates before navigation (rarely needed but safe)
    setTimeout(() => navigate(`/login/${role}`), 0);
  };

  // helper for desktop links (close dropdown then navigate)
  const handleDesktopLoginNavigate = (role) => {
    setIsDesktopLoginOpen(false);
    navigate(`/login/${role}`);
  };

  return (
    <nav className="bg-green-500 shadow-2xl fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between relative">
        {/* Logo and Name */}
        <NavLink
          to="/"
          className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto"
        >
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-14 w-14 rounded-full shadow-xl border-2 border-white"
          />
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-extrabold tracking-wide text-white">
              Terravale Ventures LLP
            </h1>
            <div className="w-50 h-[2px] bg-white mt-1 rounded-full"></div>
          </div>
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
          {/* Desktop Login Dropdown */}
          <div className="relative" ref={desktopLoginRef}>
            <button
              onClick={() => setIsDesktopLoginOpen((s) => !s)}
              className="flex items-center px-5 py-2 border border-white rounded-lg text-white hover:bg-white hover:text-green-800 transition-all duration-300 shadow-md"
              aria-expanded={isDesktopLoginOpen}
            >
              <FiLogIn className="mr-2" /> Login
              <FiChevronDown
                className={`ml-2 transform transition-transform ${
                  isDesktopLoginOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDesktopLoginOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-2xl overflow-hidden z-50">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleDesktopLoginNavigate(role)}
                    className="w-full text-left px-4 py-3 text-green-800 hover:bg-green-100 font-medium transition"
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
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
          onClick={() => setIsOpen((s) => !s)}
          className="md:hidden absolute right-4 top-4 p-2 text-white rounded-lg hover:bg-green-700 focus:outline-none z-50"
          aria-expanded={isOpen}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col md:hidden text-white font-semibold px-6 pb-4 bg-green-800 w-full shadow-inner transition-all duration-300 ease-in-out space-y-2 mt-16 z-40">
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
          <div className="border border-white rounded-lg" ref={mobileLoginRef}>
            <button
              onClick={() => setIsMobileLoginOpen((s) => !s)}
              className="w-full flex items-center justify-center py-3 text-white hover:bg-white hover:text-green-800 transition-all duration-300"
              aria-expanded={isMobileLoginOpen}
            >
              <FiLogIn className="mr-2" /> Login
              <FiChevronDown
                className={`ml-2 transform transition-transform ${
                  isMobileLoginOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileLoginOpen && (
              // make it visually above other content and clickable
              <div className="bg-white text-green-800 rounded-b-lg shadow-lg animate-fade-in z-50">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleMobileLoginNavigate(role)}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-green-100"
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
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
