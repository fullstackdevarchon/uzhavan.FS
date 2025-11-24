// src/components/BuyerNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { logout, getCurrentUser } from "../../utils/auth";

const BuyerNavbar = () => {
  const navigate = useNavigate();
  const cartState = useSelector((state) => state.handleCart);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // CLICK OUTSIDE
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

  // STYLING FOR ACTIVE NAVLINKS
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
        <div className="bg-[rgba(0,0,0,0.55)] ">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* LOGO */}
            <Link to="/buyer-dashboard" className="flex items-center gap-4">
              <img
                src="/assets/IMG-20251006-WA0016(1) (1).jpg"
                className="h-14 w-14 rounded-full border border-black shadow-lg object-cover"
              />
              <div>
                <h1 className="text-white font-extrabold text-2xl tracking-wide">
                  Buyer Dashboard
                </h1>
                <div className="w-55 h-[3px] bg-[rgba(27,60,43,0.6)] mt-1 rounded-full"></div>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/buyer-dashboard/products" className={navItemClass}>
                <span className="inline-flex items-center gap-2">
                  <FaBoxOpen /> Products
                </span>
              </NavLink>

              <NavLink to="/buyer-dashboard/orders" className={navItemClass}>
                <span className="inline-flex items-center gap-2">
                  <FaClipboardList /> My Orders
                </span>
              </NavLink>

              <NavLink to="/buyer-dashboard/cart" className={navItemClass}>
                <span className="inline-flex items-center gap-2">
                  <FaShoppingCart />
                  {loading ? (
                    <Skeleton width={40} height={20} baseColor="#aaa" />
                  ) : (
                    <>Cart ({cartState?.length || 0})</>
                  )}
                </span>
              </NavLink>

              <NavLink to="/buyer-dashboard/profile" className={navItemClass}>
                <span className="inline-flex items-center gap-2">
                  <FaUser />
                  Profile
                </span>
              </NavLink>

              {/* LOGOUT */}
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

            {/* MOBILE MENU BUTTON */}
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
              to="/buyer-dashboard/products"
              className="block py-3 border-b border-white/20"
              onClick={() => setIsOpen(false)}
            >
              <FaBoxOpen className="inline mr-3" /> Products
            </NavLink>

            <NavLink
              to="/buyer-dashboard/orders"
              className="block py-3 border-b border-white/20"
              onClick={() => setIsOpen(false)}
            >
              <FaClipboardList className="inline mr-3" /> My Orders
            </NavLink>

            <NavLink
              to="/buyer-dashboard/cart"
              className="block py-3 border-b border-white/20"
              onClick={() => setIsOpen(false)}
            >
              <FaShoppingCart className="inline mr-3" /> Cart (
              {cartState.length})
            </NavLink>

            <NavLink
              to="/buyer-dashboard/profile"
              className="block py-3 border-b border-white/20"
              onClick={() => setIsOpen(false)}
            >
              <FaUser className="inline mr-3" /> Profile
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

      {/* CONTENT */}
      <main className="flex-1 p-6 mt-24 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default BuyerNavbar;
