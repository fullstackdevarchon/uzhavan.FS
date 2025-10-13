import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        setAuth({ isAuthenticated: true, user: data.user, token: data.token });
        toast.success("Login successful!");
        navigate("/admin-dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {/* ==== LEFT PANEL / IMAGE SECTION ==== */}
      <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-10">
        <div className="max-w-md text-center space-y-6">
          <div className="bg-white/20 rounded-full p-4 w-fit mx-auto">
            <FiUser size={40} />
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            Welcome Back, Admin!
          </h2>
          <p className="text-indigo-100 text-lg">
            Manage events, members, and music classes — all from one place.
          </p>
          <div className="mt-8">
            <img
              src="https://illustrations.popsy.co/blue/office-desk.svg"
              alt="Dashboard Illustration"
              className="w-80 mx-auto drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* ==== RIGHT PANEL / FORM SECTION ==== */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <FiUser className="text-indigo-600 text-2xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="email"
                name="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:shadow-md"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:shadow-md"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg text-white transition-all duration-300 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:scale-[1.02]"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Connecting...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Forgot password?{" "}
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                Reset here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
