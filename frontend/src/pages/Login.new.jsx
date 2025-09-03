// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Footer, Navbar } from "../components";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useParams();

  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  // Validate role
  const allowedRoles = ["buyer", "seller", "admin"];
  const currentRole = allowedRoles.includes(role) ? role : "buyer";

  // Handle successful login
  const handleLoginSuccess = async (user, token) => {
    try {
      // Clear any existing data first
      localStorage.clear();
      Cookies.remove('role', { path: '/' });
      Cookies.remove('token', { path: '/' });

      // Set new data
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      // Set cookies
      Cookies.set("role", user.role, { 
        expires: 1,
        path: '/',
        secure: false,
        sameSite: 'Lax'
      });

      Cookies.set("token", token || "temptoken", {
        expires: 1,
        path: '/',
        secure: false,
        sameSite: 'Lax'
      });

      // Verify storage
      const storedUser = localStorage.getItem("user");
      const storedRole = Cookies.get("role");
      const storedToken = Cookies.get("token");

      if (!storedUser || !storedRole || !storedToken) {
        throw new Error("Failed to store authentication data");
      }

      // Navigate to dashboard
      const path = user.role === "admin" 
        ? "/admin/dashboard"
        : user.role === "seller"
          ? "/seller/dashboard"
          : "/buyer-dashboard";

      console.log("Storage verified, navigating to:", path);
      navigate(path, { replace: true });

    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = `http://localhost:5000/api/users${
        isRegister ? "/register" : "/login"
      }`;

      const payload = isRegister
        ? { fullName, email, pass: password, role: currentRole }
        : { email, pass: password, role: currentRole };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (!isRegister && data.user) {
        await handleLoginSuccess(data.user, data.token);
      } else if (isRegister) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => setIsRegister(false), 1500);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const savedRole = Cookies.get("role");
      const token = Cookies.get("token");

      console.log("Auth check:", { user, savedRole, token });

      if (user && savedRole && token) {
        const path = savedRole === "admin"
          ? "/admin/dashboard"
          : savedRole === "seller"
            ? "/seller/dashboard"
            : "/buyer-dashboard";
        navigate(path, { replace: true });
      }
    };

    if (!authChecked) {
      checkAuth();
      setAuthChecked(true);
    }
  }, [navigate, authChecked]);

  if (!authChecked) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 pt-20 pb-10">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-200">
          <h1 className="text-4xl font-extrabold text-center text-green-800 mb-2">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-center text-gray-600 mb-8 capitalize">
            {isRegister ? `Register as ${currentRole}` : `Login as ${currentRole}`}
          </p>
          <hr className="mb-8 border-gray-300" />

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3 text-center font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3 text-center font-medium animate-pulse">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegister && currentRole !== "admin" && (
              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
            )}

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>

            <div className="text-sm text-gray-600 text-center">
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="font-semibold text-green-600 hover:underline"
                  >
                    Login
                  </button>
                </>
              ) : currentRole !== "admin" ? (
                <>
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="font-semibold text-green-600 hover:underline"
                  >
                    Register
                  </button>
                </>
              ) : null}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition"
              >
                {isRegister ? "Register" : "Login"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
