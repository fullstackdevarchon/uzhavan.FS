import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaClipboardList,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaWarehouse,
  FaTruck,
  FaTags,
  FaChevronDown,
  FaUserPlus,
  FaListUl,
} from "react-icons/fa";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login", { replace: true });
    window.location.reload();
  };

  const navLinks = [
    { path: "products", icon: FaBoxOpen, text: "Product List" },
    { path: "seller-requests", icon: FaClipboardList, text: "Seller Requests" },
    { path: "analytics", icon: FaChartLine, text: "Analytics" },
    { path: "inventory", icon: FaWarehouse, text: "Inventory" },
    { path: "orders", icon: FaTruck, text: "Orders" },
    { path: "categories", icon: FaTags, text: "Categories" },
  ];

  const deliveryLinks = [
    { path: "delivery/add-labour", text: "Add Labour", icon: FaUserPlus },
    { path: "delivery/labour-list", text: "Labour List", icon: FaListUl },
    { path: "delivery/labour-orders", text: "Labour Orders", icon: FaClipboardList },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDeliveryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🔹 Top Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg px-4 sm:px-6 py-3 flex items-center justify-between z-50">
        {/* 🔹 Logo + Title */}
        <Link to="/admin-dashboard" className="flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full shadow-lg border-2 border-white"
          />
          <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-wide text-white drop-shadow-md">
            Admin Dashboard
          </h1>
        </Link>

        {/* 🔹 Desktop / Tablet Links */}
        <div className="hidden md:flex gap-5 text-white font-medium text-sm items-center">
          {navLinks.map(({ path, icon: Icon, text }) => (
            <Link
              key={path}
              to={`/admin-dashboard/${path}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 transition relative group"
            >
              <Icon />
              {text}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {/* 🔹 Delivery Dropdown (Desktop) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDeliveryOpen(!deliveryOpen)}
              className="flex items-center gap-2 hover:text-gray-200 px-3 py-1.5 rounded-md hover:bg-white/10 transition"
            >
              <FaTruck />
              Delivery
              <FaChevronDown
                className={`text-xs transition-transform duration-300 ${
                  deliveryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute right-0 mt-2 w-48 bg-white/95 text-gray-800 rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 transform origin-top ${
                deliveryOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              {deliveryLinks.map(({ path, text, icon: Icon }) => (
                <Link
                  key={path}
                  to={`/admin-dashboard/${path}`}
                  onClick={() => setDeliveryOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-indigo-50 transition"
                >
                  <Icon className="text-indigo-600" /> {text}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md shadow-md transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* 🔹 Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* 🔹 Mobile / Tablet Menu */}
      {menuOpen && (
        <div className="fixed top-[60px] left-0 w-full bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600 shadow-lg flex flex-col px-6 py-4 gap-3 text-white font-medium text-base sm:text-sm z-40 animate-fadeIn">
          {navLinks.map(({ path, icon: Icon, text }) => (
            <Link
              key={path}
              to={`/admin-dashboard/${path}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 border-b border-white/30 pb-2 hover:text-gray-200 transition"
            >
              <Icon /> {text}
            </Link>
          ))}

          {/* 🔹 Delivery Dropdown (Mobile) */}
          <div>
            <button
              onClick={() => setDeliveryOpen(!deliveryOpen)}
              className="flex items-center gap-2 border-b border-white/30 pb-2 w-full"
            >
              <FaTruck /> Delivery
              <FaChevronDown
                className={`ml-auto transform transition-transform duration-300 ${
                  deliveryOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`ml-6 flex flex-col gap-2 mt-2 border-l border-white/30 pl-3 transition-all duration-300 overflow-hidden ${
                deliveryOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {deliveryLinks.map(({ path, text, icon: Icon }) => (
                <Link
                  key={path}
                  to={`/admin-dashboard/${path}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm hover:text-gray-200 transition"
                >
                  <Icon /> {text}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-2 text-red-200 hover:text-red-400 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}

      {/* 🔹 Main Page Content */}
      <main className="flex-1 pt-20 px-4 sm:px-6 md:px-8 lg:px-10 animate-fadeIn">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminNavbar;
