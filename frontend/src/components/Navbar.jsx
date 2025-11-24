import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiLogIn,
  FiMenu,
  FiX,
  FiChevronDown,
  FiUser,
} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Navbar = () => {
  const cartState = useSelector((state) => state.handleCart);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopLoginOpen, setIsDesktopLoginOpen] = useState(false);
  const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false);

  const desktopLoginRef = useRef(null);
  const mobileLoginRef = useRef(null);
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/product", name: "Products" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
  ];

  const roles = ["seller", "buyer"];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Click outside (Desktop)
  useEffect(() => {
    const handler = (e) => {
      if (desktopLoginRef.current && !desktopLoginRef.current.contains(e.target)) {
        setIsDesktopLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Click outside (Mobile)
  useEffect(() => {
    const handler = (e) => {
      if (mobileLoginRef.current && !mobileLoginRef.current.contains(e.target)) {
        setIsMobileLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goLoginDesktop = (role) => {
    setIsDesktopLoginOpen(false);
    navigate(`/login/${role}`);
  };

  const goLoginMobile = (role) => {
    setIsMobileLoginOpen(false);
    setIsOpen(false);
    navigate(`/login/${role}`);
  };

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        bg-cover bg-center bg-fixed bg-no-repeat
        shadow-lg border-b border-white/20
      "
      style={{
        backgroundImage: `url('/assets/IMG-20251013-WA0000.jpg')`,
      }}
    >
      <div className="bg-[rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            <img
              src="/assets/IMG-20251006-WA0016(1) (1).jpg"
              alt="Logo"
              className="h-14 w-14 rounded-full border border-white shadow"
            />
            <div>
              <h1 className="text-white font-bold text-xl drop-shadow-md tracking-wide">
                Terravale Ventures LLP
              </h1>
              <div className="w-42 h-[3px] bg-[rgba(27,60,43,0.6)] mt-1 rounded-full"></div>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-10 text-white font-medium text-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition duration-200 
                  ${
                    isActive
                      ? "bg-[rgba(27,60,43,0.8)] border border-[rgba(27,60,43,1)]"
                      : "hover:bg-[rgba(27,60,43,0.6)]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

        {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4 relative">

              {/* LOGIN BUTTON */}
              <div className="relative" ref={desktopLoginRef}>
                <button
                  onClick={() => setIsDesktopLoginOpen(!isDesktopLoginOpen)}
                  className="
                    flex items-center px-4 py-2 
                    border border-white/40 text-white
                    rounded-md bg-white/10 
                    hover:bg-[rgba(27,60,43,0.6)] hover:scale-105
                    transition shadow-md font-semibold
                  "
                >
                  <FiLogIn className="mr-2 text-yellow-400" /> Login
                  <FiChevronDown
                    className={`ml-2 transition ${isDesktopLoginOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDesktopLoginOpen && (
                  <div
                    className="
                      absolute right-0 mt-3 w-44 
                      bg-white text-gray-900 
                      rounded-lg shadow-xl animate-fadeIn
                    "
                  >
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => goLoginDesktop(role)}
                        className="
                          flex items-center gap-3 w-full text-left 
                          px-4 py-3 hover:bg-green-100
                          font-bold text-[15px]
                        "
                      >
                        <FiUser className="text-green-700" /> {role.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CART BUTTON */}
              <NavLink
                to="/cart"
                className="
                  flex items-center px-4 py-2 
                  border border-white/40 text-white 
                  rounded-md bg-white/10 
                  hover:bg-[rgba(27,60,43,0.6)] hover:scale-105
                  transition shadow-md font-semibold
                "
              >
                <FiShoppingCart className="mr-2 text-[#1B3C2B]" />
                {loading ? (
                  <Skeleton width={40} height={20} baseColor="#999" />
                ) : (
                  <>Cart ({cartState.length})</>
                )}
              </NavLink>
            </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="
          bg-[rgba(0,0,0,0.5)]
          text-white px-6 py-4 space-y-4 
          border-t border-white/20 backdrop-blur-md animate-fadeIn
        ">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="
                block py-3 px-3 rounded-md border-b border-white/20 
                hover:bg-[rgba(27,60,43,0.6)]
              "
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile Login */}
          <div ref={mobileLoginRef} className="border border-white/30 rounded-lg">
            <button
              onClick={() => setIsMobileLoginOpen(!isMobileLoginOpen)}
              className="w-full py-3 flex items-center justify-center"
            >
              <FiLogIn className="mr-2 text-yellow-400" /> Login
              <FiChevronDown
                className={`ml-2 transition ${isMobileLoginOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMobileLoginOpen && (
              <div className="bg-[rgba(248, 247, 247, 0.5)] border-t border-white/10 animate-fadeIn">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => goLoginMobile(role)}
                    className="
                      flex items-center gap-3 w-full text-left 
                      px-4 py-3 hover:bg-green-700
                      font-bold
                    "
                  >
                    <FiUser className="text-yellow-300" /> {role.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Cart */}
          <NavLink
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="
              block text-center py-3 border border-white/30 
              rounded-lg hover:bg-green-700 font-semibold
            "
          >
            <FiShoppingCart className="inline mr-2 text-[#1B3C2B]" /> Cart ({cartState.length})
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
