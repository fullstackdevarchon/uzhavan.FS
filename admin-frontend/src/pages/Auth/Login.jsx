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

  // Forgot Password Modal States
  const [showForgot, setShowForgot] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ========== LOGIN HANDLER ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // ========== FORGOT PASSWORD HANDLERS ==========

  // Step 1: Send OTP (Only Admin Email)
  const handleSendOtp = async () => {
    if (!email) return toast.error("Enter your admin email");

    setForgotLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/forgot/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("OTP sent to your email");
        setOtpStage(true);
      } else {
        toast.error(data.message || "Invalid admin email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async () => {
    if (!otp || !newPassword) return toast.error("Enter all fields");

    setForgotLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/forgot/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
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
      toast.error("Server error");
    } finally {
      setForgotLoading(false);
    }
  };

  // ========== RETURN JSX ==========
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-10">
        <div className="text-center mb-8">
          <FaUserShield className="text-white text-4xl mx-auto drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Admin Login
          </h2>
          <p className="text-sm text-gray-200 mt-2">
            Sign in to access your admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Forgot Password Link */}
          <p
            className="text-right text-sm text-indigo-200 hover:text-white cursor-pointer"
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </p>

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
          © {new Date().getFullYear()} Terravale Ventures LLP  | All rights reserved
        </p>
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
                  placeholder="Enter admin email"
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
