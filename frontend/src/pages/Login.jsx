import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Footer, Navbar } from "../components";

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const allowedRoles = ["buyer", "seller"];
  const currentRole = allowedRoles.includes(role) ? role : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = `http://localhost:5000/api/users${isRegister ? "/register" : "/login"}`;
      const payload = isRegister
        ? { fullName, email, pass: password, role: currentRole }
        : { email, pass: password };

      console.log("🔹 Sending request:", { url, payload });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📨 Backend response:", data);

      if (!res.ok) return setError(data.message || "Something went wrong");

      if (!isRegister && data.user) {
        const { user, token } = data;
        if (!token) throw new Error("No token received");

        const authData = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        };

        // Save in localStorage
        localStorage.setItem("user", JSON.stringify(authData));
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);

        // Try cookies (not mandatory for localhost)
        Cookies.set("token", token, { path: "/", expires: 1, sameSite: "lax" });
        Cookies.set("role", user.role, { path: "/", expires: 1, sameSite: "lax" });

        console.log("🔐 Auth saved:", { authData, tokenPreview: token.substring(0, 15) + "..." });

        navigate(user.role === "seller" ? "/seller/dashboard" : "/buyer-dashboard", { replace: true });
      } else if (isRegister) {
        setSuccess("Registration successful! Please login.");
        setTimeout(() => setIsRegister(false), 1500);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 pt-20 pb-10">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
          <h1 className="text-4xl font-extrabold text-center text-green-800 mb-2">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {isRegister ? `Register as ${currentRole}` : `Login as ${currentRole}`}
          </p>

          {error && <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">{error}</div>}
          {success && <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded">{success}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegister && (
              <div>
                <label className="block mb-2 font-semibold">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                  className="border rounded-lg p-3 w-full" />
              </div>
            )}
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="border rounded-lg p-3 w-full" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="border rounded-lg p-3 w-full" />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md">
                {isRegister ? "Register" : "Login"}
              </button>
            </div>
          </form>

          <p className="text-center mt-4">
            {isRegister ? (
              <>Already have an account? <button onClick={() => setIsRegister(false)} className="text-green-600">Login</button></>
            ) : (
              <>New here? <button onClick={() => setIsRegister(true)} className="text-green-600">Register</button></>
            )}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
