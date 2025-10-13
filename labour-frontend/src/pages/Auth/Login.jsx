import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/labours/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        if (data.token) localStorage.setItem("token", data.token);
        const u = data.user || data.labour || {};
        if (u._id || u.id) localStorage.setItem("userId", u._id || u.id);
        if (u.role) localStorage.setItem("role", u.role);

        login(u, data.token);
        toast.success(`Welcome back, ${u.fullName || "User"}!`);
        navigate("/labour-dashboard");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("⚠️ Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* ==== LEFT PANEL (Brand Section) ==== */}
      <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-10">
        <div className="max-w-md text-center space-y-6">
          <div className="bg-white/20 rounded-full p-4 w-fit mx-auto">
            <FiUser size={40} />
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            Welcome Back, Labour!
          </h2>
          <p className="text-indigo-100 text-lg">
            Access your daily tasks, updates, and dashboard easily.
          </p>
          <div className="mt-8">
            {/* <img
              src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.svgrepo.com%2Fsvg%2F281419%2Fworker&psig=AOvVaw0zFkSAcZp_ER7BYHU8YcaW&ust=1759904596236000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJDD29O5kZADFQAAAAAdAAAAABAE"
              alt="Labour Dashboard Illustration"
              className="w-80 mx-auto drop-shadow-xl"
            /> */}
          </div>
        </div>
      </div>

      {/* ==== RIGHT PANEL (Login Form) ==== */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <FiUser className="text-indigo-600 text-2xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Labour Login</h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to access your work dashboard
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

            {/* Submit Button */}
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
                {/* Reset here */}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
