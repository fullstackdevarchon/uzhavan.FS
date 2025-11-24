// src/components/SellerNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  FaPlusCircle,
  FaClipboardCheck,
  FaBoxOpen,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { logout, getCurrentUser } from "../../utils/auth";

const SellerNavbar = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // CLOSE MENU ON OUTSIDE CLICK
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
  };

  // ACTIVE NAV CLASS
  const navItemClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition font-semibold text-[17px] ${
      isActive
        ? "bg-[rgba(27,60,43,0.85)] border border-white/40 text-yellow-300"
        : "text-white hover:bg-[rgba(27,60,43,0.7)]"
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav
        className="
          fixed top-0 left-0 w-full z-50 bg-cover bg-center bg-fixed bg-no-repeat
          shadow-lg border-b border-white/10
        "
        style={{
          backgroundImage: `url('/assets/IMG-20251013-WA0000.jpg')`,
        }}
      >
        <div className="bg-[rgba(0,0,0,0.55)]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* LOGO + TITLE */}
            <Link to="/seller" className="flex items-center gap-4">
              <img
                src="/assets/IMG-20251006-WA0016(1) (1).jpg"
                alt="Seller Logo"
                className="h-14 w-14 rounded-full border border-black shadow-lg object-cover"
              />

              <div>
                <h1 className="text-white font-extrabold text-2xl tracking-wide">
                  Seller Dashboard
                </h1>

                {/* UNDERLINE BAR (MATCHING BUYER STYLE BUT ORANGE THEME) */}
                <div className="w-56 h-[3px] bg-[rgba(27,60,43,0.7)] mt-1 rounded-full"></div>
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/seller/add-product" className={navItemClass}>
                <span className="inline-flex items-center gap-2">
                  <FaPlusCircle /> Add Product
                </span>
              </NavLink>

              <NavLink to="/seller/my-products" className={navItemClass}>
                <span className="inline-flex items-center gap-2">
                  <FaBoxOpen /> My Products
                </span>
              </NavLink>

              <NavLink to="/seller/check-status" className={navItemClass}>
                <span className="inline-flex items-center gap-2">
                  <FaClipboardCheck /> Check Status
                </span>
              </NavLink>

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="
                  text-red-300 hover:text-red-200 
                  font-semibold flex items-center gap-2 px-4 py-2 
                  bg-white/10 border border-white/30 rounded-lg 
                  hover:bg-red-800/40 transition
                "
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white text-3xl"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="
              md:hidden bg-[rgba(0,0,0,0.55)] backdrop-blur-md 
              px-6 py-4 space-y-4 text-white animate-fadeIn border-t border-white/20
            "
          >
            <NavLink
              to="/seller/add-product"
              className="block py-3 border-b border-white/20"
              onClick={() => setIsOpen(false)}
            >
              <FaPlusCircle className="inline mr-3" /> Add Product
            </NavLink>

            <NavLink
              to="/seller/my-products"
              className="block py-3 border-b border-white/20"
              onClick={() => setIsOpen(false)}
            >
              <FaBoxOpen className="inline mr-3" /> My Products
            </NavLink>

            <NavLink
              to="/seller/check-status"
              className="block py-3 border-b border-white/20"
              onClick={() => setIsOpen(false)}
            >
              <FaClipboardCheck className="inline mr-3" /> Check Status
            </NavLink>

            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block py-3 w-full text-left text-red-300 font-semibold"
            >
              <FaSignOutAlt className="inline mr-3" /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6 mt-24 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerNavbar;
