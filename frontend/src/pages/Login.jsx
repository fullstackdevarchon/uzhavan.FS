import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock Users Data
  const buyers = [
    { email: "buyer1@example.com", password: "123" },
    { email: "buyer2@example.com", password: "123" },
    { email: "buyer3@example.com", password: "123" },
  ];

  const sellers = [
    { email: "seller1@example.com", password: "123" },
    { email: "seller2@example.com", password: "123" },
    { email: "seller3@example.com", password: "123" },
  ];

  const admins = [
    { email: "admin@example.com", password: "123" }
  ];

  // Handle Login
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check Buyer
    const buyer = buyers.find(
      (user) => user.email === email && user.password === password
    );
    if (buyer) {
      setSuccess("Login successful! Redirecting to Buyer Dashboard...");
      setTimeout(() => navigate("/buyer-dashboard"), 1500);
      return;
    }

    // Check Seller
    const seller = sellers.find(
      (user) => user.email === email && user.password === password
    );
    if (seller) {
      setSuccess("Login successful! Redirecting to Seller Dashboard...");
      setTimeout(() => navigate("/seller-dashboard"), 1500);
      return;
    }

    // Check Admin
    const admin = admins.find(
      (user) => user.email === email && user.password === password
    );
    if (admin) {
      setSuccess("Login successful! Redirecting to Admin Dashboard...");
      setTimeout(() => navigate("/admin-dashboard"), 1500);
      return;
    }

    // If not matched
    setError("Invalid email or password. Please try again.");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-200">
          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Login to continue exploring
          </p>
          <hr className="mb-8 border-gray-300" />

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3 text-center font-medium">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3 text-center font-medium animate-pulse">
              {success}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-2 font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-2 font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                required
              />
            </div>

            {/* Register Link */}
            <div className="text-sm text-gray-600">
              New here?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Register
              </Link>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                Login
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
