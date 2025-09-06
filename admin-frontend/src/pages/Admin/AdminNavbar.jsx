import React, { useState } from "react";
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
} from "react-icons/fa";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔹 Clear all stored auth info
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    // 🔹 Clear cookies too
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 🔹 Navigate instantly to login
    navigate("/login", { replace: true });

    // 🔹 Force reload to reset app state (prevents showing protected routes until refresh)
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed Top Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg px-6 py-4 flex items-center justify-between z-50">
        {/* Logo + Title */}
        <Link to="/admin-dashboard" className="flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-12 w-12 rounded-full shadow-lg"
          />
          <h1 className="text-2xl md:text-2xl font-extrabold tracking-wide text-white drop-shadow-md">
            Admin Dashboard
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-white font-medium text-lg">
          {navLinks.map(({ path, icon: Icon, text }) => (
            <Link
              key={path}
              to={`/admin-dashboard/${path}`}
              className="flex items-center gap-2 relative group"
            >
              <Icon />
              {text}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-red-300 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed top-[72px] left-0 w-full bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600 shadow-lg flex flex-col px-6 py-4 gap-4 text-white font-medium text-lg z-40">
          {navLinks.map(({ path, icon: Icon, text }) => (
            <Link
              key={path}
              to={`/admin-dashboard/${path}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 border-b border-white/40 pb-2"
            >
              <Icon /> {text}
            </Link>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-2 text-red-200 border-b border-white/40 pb-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pt-24 px-4 md:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminNavbar;
