// src/components/SellerNavbar.jsx
import React from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  FaPlusCircle,
  FaClipboardCheck,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";

const SellerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-2 pb-1 transition-colors duration-300 border-b-2 ${
      isActive
        ? "text-yellow-400 font-semibold border-yellow-400"
        : "text-white hover:text-yellow-300 border-transparent"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-orange-600 shadow-2xl fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
          {/* Left: Logo + Title clickable */}
          <Link
            to="/seller-dashboard"
            className="flex items-center gap-3 w-full md:w-auto mb-3 md:mb-0 justify-center md:justify-start"
          >
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="h-12 w-12 rounded-full shadow-xl border-2 border-white object-cover"
            />
            <h1 className="text-xl md:text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white drop-shadow-lg whitespace-nowrap">
              Seller Dashboard
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 font-medium text-white">
            <NavLink
              to="/seller-dashboard/add-product"
              className={navLinkClass}
            >
              <FaPlusCircle className="inline mr-1" /> Add Product
            </NavLink>

            <NavLink
              to="/seller-dashboard/my-products"
              className={navLinkClass}
            >
              <FaBoxOpen className="inline mr-1" /> My Products
            </NavLink>

            <NavLink
              to="/seller-dashboard/check-status"
              className={navLinkClass}
            >
              <FaClipboardCheck className="inline mr-1" /> Check Status
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-100 hover:text-red-900 font-semibold transition-colors focus:outline-none"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Mobile Nav (horizontal buttons) */}
          <div className="flex md:hidden justify-around w-full mt-3 border-t border-white/20 pt-2">
            <NavLink
              to="/seller-dashboard/add-product"
              className={navLinkClass}
            >
              <FaPlusCircle className="inline mr-1" /> Add
            </NavLink>

            <NavLink
              to="/seller-dashboard/my-products"
              className={navLinkClass}
            >
              <FaBoxOpen className="inline mr-1" /> My
            </NavLink>

            <NavLink
              to="/seller-dashboard/check-status"
              className={navLinkClass}
            >
              <FaClipboardCheck className="inline mr-1" /> Status
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-200 hover:text-red-100 font-semibold border-b-2 border-transparent hover:border-red-300 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area (with padding for fixed navbar) */}
      <main className="flex-1 p-6 bg-gray-50 mt-32 md:mt-20">
        <Outlet /> {/* Nested seller routes will render here */}
      </main>
    </div>
  );
};

export default SellerNavbar;
