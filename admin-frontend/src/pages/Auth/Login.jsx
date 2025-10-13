import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import toast from "react-hot-toast";
import { FaUserShield, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          pass: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user?.role === "admin") {
        login(data);
        toast.success("Welcome back, Admin!");
        navigate("/admin-dashboard");
      } else {
        toast.error(data.message || "Access denied");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 relative overflow-hidden">
      {/* Background Animated Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-3">
            <FaUserShield className="text-white text-4xl drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Admin Login
          </h2>
          <p className="text-sm text-gray-200 mt-2">
            Sign in to access your admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="peer w-full px-4 pt-5 pb-2 text-sm text-white placeholder-transparent bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2.5 text-gray-300 text-xs transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs"
            >
              Email Address
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="peer w-full px-4 pt-5 pb-2 text-sm text-white placeholder-transparent bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2.5 text-gray-300 text-xs transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs"
            >
              Password
            </label>
            <FaLock className="absolute right-3 top-3.5 text-gray-400 text-sm" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold text-white rounded-lg shadow-md transition-all duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-gray-200 mt-6">
          © {new Date().getFullYear()} VFAC.COM | All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
