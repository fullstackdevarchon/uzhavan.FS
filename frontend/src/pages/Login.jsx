import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import PageContainer from "../components/PageContainer";

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false); // 🔹 New: forgot password mode
  const [step, setStep] = useState(1); // 🔹 Step 1 = send OTP, Step 2 = verify OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Allowed roles
  const allowedRoles = ["buyer", "seller"];
  const currentRole = allowedRoles.includes(role) ? role : "buyer"; // fallback: buyer

  // 🔹 Handle Login / Register
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
        : { email, pass: password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Something went wrong");

      // ✅ Login flow
      if (!isRegister && data.user) {
        const { user, token } = data;

        if (!token) return setError("Authentication failed: No token received");
        if (user.role !== currentRole) {
          alert(`You are not a ${currentRole}! Your account is ${user.role}.`);
          return;
        }

        const authData = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          token,
        };

        localStorage.setItem("user", JSON.stringify(authData));
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);

        Cookies.set("token", token, { path: "/", expires: 1, sameSite: "Strict" });
        Cookies.set("role", user.role, { path: "/", expires: 1, sameSite: "Strict" });

        alert("Login successful!");

        navigate(
          user.role === "seller" ? "/seller/dashboard" : "/buyer-dashboard",
          { replace: true }
        );
      }

      // ✅ Registration flow
      else if (isRegister) {
        setSuccess("Registration successful! Please login.");
        setTimeout(() => setIsRegister(false), 1500);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  // 🔹 Handle sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/forgot/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to send OTP");

      setSuccess("OTP sent successfully! Check your email.");
      setStep(2);
    } catch (err) {
      setError("Error sending OTP. Try again.");
    }
  };

  // 🔹 Handle resetting password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/forgot/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "OTP verification failed");

      setSuccess("Password reset successful! Please login.");
      setTimeout(() => {
        setIsForgot(false);
        setStep(1);
      }, 2000);
    } catch (err) {
      setError("Error resetting password. Try again.");
    }
  };

  return (
    <PageContainer>
      <main className="flex items-center justify-center">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
          {/* 🔹 Dynamic Heading */}
          <h1 className="text-4xl font-extrabold text-center text-green-800 mb-2">
            {isForgot
              ? "Forgot Password"
              : isRegister
              ? "Create Account"
              : "Welcome Back"}
          </h1>

          <p className="text-center text-gray-600 mb-8">
            {isForgot
              ? "Reset your password using OTP"
              : isRegister
              ? `Register as ${currentRole}`
              : `Login as ${currentRole}`}
          </p>

          {/* Error / Success Alerts */}
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* ============================== */}
          {/* 🔹 Forgot Password Flow */}
          {/* ============================== */}
          {isForgot ? (
            <form
              className="space-y-6"
              onSubmit={step === 1 ? handleSendOTP : handleResetPassword}
            >
              <div>
                <label className="block mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border rounded-lg p-3 w-full"
                />
              </div>

              {step === 2 && (
                <>
                  <div>
                    <label className="block mb-2 font-semibold">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="border rounded-lg p-3 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="border rounded-lg p-3 w-full"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                >
                  {step === 1 ? "Send OTP" : "Reset Password"}
                </button>
              </div>

              <p className="text-center mt-4">
                <button
                  onClick={() => {
                    setIsForgot(false);
                    setStep(1);
                  }}
                  className="text-green-600 hover:underline"
                >
                  Back to Login
                </button>
              </p>
            </form>
          ) : (
            <>
              {/* ============================== */}
              {/* 🔹 Login / Register Form */}
              {/* ============================== */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {isRegister && (
                  <div>
                    <label className="block mb-2 font-semibold">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="border rounded-lg p-3 w-full"
                    />
                  </div>
                )}
                <div>
                  <label className="block mb-2 font-semibold">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border rounded-lg p-3 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border rounded-lg p-3 w-full"
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                  >
                    {isRegister ? "Register" : "Login"}
                  </button>
                </div>
              </form>

              {/* 🔹 Footer Links */}
              <p className="text-center mt-4">
                {isRegister ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsRegister(false)}
                      className="text-green-600 hover:underline"
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    New here?{" "}
                    <button
                      onClick={() => setIsRegister(true)}
                      className="text-green-600 hover:underline"
                    >
                      Register
                    </button>
                    <br />
                    <button
                      onClick={() => setIsForgot(true)}
                      className="text-sm text-gray-600 hover:text-green-600 mt-2"
                    >
                      Forgot Password?
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </main>
    </PageContainer>
  );
};

export default Login;
