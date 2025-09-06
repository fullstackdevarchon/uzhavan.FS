import React, { useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import toast from "react-hot-toast";
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
  const { authState, login } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  // Logo section for navbar
  const LogoSection = () => (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-white">Admin Panel</span>
    </div>
  );

  // Navigation Links
  const NavLinks = () => (
    <>
      <Link
        to="/admin-dashboard"
        className="flex items-center gap-2 relative group"
      >
        <FaChartLine />
        Dashboard
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
      </Link>

      <Link
        to="/admin-dashboard/categories"
        className="flex items-center gap-2 relative group"
      >
        <FaTags />
        Categories
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Top Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg px-6 py-4 flex items-center justify-between z-50">
        <LogoSection />

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-white font-medium text-lg">
          <NavLinks />
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
          <NavLinks />
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

      {/* Content Area */}
      <main className="flex-1 pt-24 px-4 md:px-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminNavbar;