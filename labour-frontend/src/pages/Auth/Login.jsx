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
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Forgot Password states
  const [showForgot, setShowForgot] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Input handler
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ===== LOGIN HANDLER =====
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

  // ===== FORGOT PASSWORD HANDLERS =====
  const handleSendOtp = async () => {
    if (!email) return toast.error("Enter your email");

    setForgotLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout safeguard

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/forgot/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role: "labour" }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      const data = await res.json();
      if (res.ok) {
        toast.success("✅ OTP sent successfully! (Please check your email)");
        setOtpStage(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        toast.error("Request timed out. Please try again.");
      } else {
        console.error(err);
        toast.error("Server error while sending OTP");
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) return toast.error("Enter all fields");

    setForgotLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/forgot/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword, role: "labour" }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successful!");
        setShowForgot(false);
        setOtpStage(false);
        setEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        toast.error(data.message || "Invalid OTP or email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while resetting password");
    } finally {
      setForgotLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Left Panel */}
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
        </div>
      </div>

      {/* Right Panel */}
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

          {/* Forgot Password Link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Forgot password?{" "}
              <span
                onClick={() => setShowForgot(true)}
                className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                Reset here
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              {otpStage ? "Reset Password" : "Forgot Password"}
            </h3>

            {!otpStage ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  onClick={handleSendOtp}
                  disabled={forgotLoading}
                  className={`w-full py-2 rounded-lg text-white font-semibold ${
                    forgotLoading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {forgotLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  onClick={handleResetPassword}
                  disabled={forgotLoading}
                  className={`w-full py-2 rounded-lg text-white font-semibold ${
                    forgotLoading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowForgot(false);
                setOtpStage(false);
              }}
              className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
