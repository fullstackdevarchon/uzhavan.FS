import { useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const LabourNavbar = () => {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    {
      name: "Order List",
      to: "/labour-dashboard/order-list",
      icon: <FaClipboardList />,
    },
    {
      name: "My Orders",
      to: "/labour-dashboard/my-orders",
      icon: <FaCheckCircle />,
    },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative px-2 transition-colors duration-300 flex items-center gap-2 ${
      isActive
        ? "text-yellow-300 font-semibold after:w-full"
        : "text-white hover:text-yellow-300 after:w-0"
    } after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-yellow-300 after:transition-all`;

  const iconCircleClass =
    "p-1 rounded-full bg-white/20 text-white flex items-center justify-center text-base";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Fixed Navbar */}
      <nav className="bg-indigo-800 fixed top-0 left-0 w-full shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Title */}
          <Link to="/labour-dashboard/order-list" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full shadow-lg border-2 border-white object-cover"
            />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Labour Dashboard</h1>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center space-x-6 font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink to={item.to} className={navLinkClass} end={false}>
                  <span className={iconCircleClass}>{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
            <li>
              <div className="flex items-center gap-2">
                {/* <span className="text-white hidden lg:flex items-center gap-2">
                  <FaUserCircle className="text-white/90" />
                  {authState.user?.name || "Labour"}
                </span> */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-200 hover:text-red-100 font-semibold transition-colors focus:outline-none"
                >
                  <span className={iconCircleClass}>
                    <FaSignOutAlt />
                  </span>
                  Logout
                </button>
              </div>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none ml-auto"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden bg-green-600 shadow-inner px-6 py-2 rounded-b-2xl divide-y divide-white/30">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-3 flex items-center gap-2 ${
                    isActive ? "text-yellow-300 font-semibold" : "text-white hover:text-yellow-200"
                  }`
                }
              >
                <span className={iconCircleClass}>{item.icon}</span>
                {item.name}
              </NavLink>
            ))}

            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block py-3 w-full text-left flex items-center gap-2 text-red-200 hover:text-red-100 font-semibold transition-colors focus:outline-none"
            >
              <span className={iconCircleClass}>
                <FaSignOutAlt />
              </span>
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Content Area */}
      <main className="flex-1 p-6 bg-gray-50 mt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default LabourNavbar;
