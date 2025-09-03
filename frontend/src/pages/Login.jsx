// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [authChecked, setAuthChecked] = useState(false);

  // Allowed roles
  const allowedRoles = ["buyer", "seller", "admin"];
  const currentRole = allowedRoles.includes(role) ? role : null;

  // ---- Handle Submit ----
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

      console.log("🔹 Sending request:", { url, payload });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📨 Backend response:", data);

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      // --- Login flow ---
      if (!isRegister && data.user) {
        const userRole = data.user.role;
        if (!userRole) throw new Error("Invalid user role received from backend");

        console.log("✅ Login success:", {
          returnedRole: userRole,
          email: data.user.email,
        });

        // Get token from response
        const token = data.token;
        
        if (!token) {
          setError("Authentication failed - no token received");
          return;
        }

        // Save auth data with proper structure
        const authData = {
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          role: userRole
        };
        localStorage.setItem("user", JSON.stringify(authData));
        localStorage.setItem("role", userRole);
        localStorage.setItem("token", token);

        console.log("📦 Stored auth data after login:", {
          user: JSON.parse(localStorage.getItem("user")),
          role: localStorage.getItem("role"),
          token: localStorage.getItem("token") ? "✅ exists" : "❌ missing",
        });

        // Set cookie for role
        document.cookie = `role=${userRole}; path=/; max-age=86400`;

        // Redirect based on role with proper paths
        const dashboardPath =
          userRole === "admin"
            ? "/admin-dashboard"
            : userRole === "seller"
            ? "/seller/dashboard"
            : "/buyer-dashboard";

        console.log("➡️ Redirecting to:", dashboardPath);
        
        // Ensure cookies are set before redirecting
        document.cookie = `token=${token}; path=/; max-age=86400`;
        document.cookie = `role=${userRole}; path=/; max-age=86400`;
        
        // Navigate after a short delay to ensure storage updates
        setTimeout(() => {
          window.location.href = dashboardPath;
        }, 100);
      }

      // --- Register flow ---
      else if (isRegister) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => setIsRegister(false), 1500);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  // ---- Auth Check ----
  useEffect(() => {
    const checkAuth = () => {
      try {
        const rawUser = localStorage.getItem("user");
        const storedRole = localStorage.getItem("role");
        const token = localStorage.getItem("token");

        // Skip auth check if we're already on the login page
        if (window.location.pathname.includes("login")) {
          return;
        }

        let user = null;
        if (rawUser) {
          try {
            user = JSON.parse(rawUser);
          } catch {
            console.error("❌ Failed to parse user JSON");
            localStorage.clear();
            return;
          }
        }

        const storage = { user, role: storedRole, token };
        console.log("🔍 Auth check storage:", storage);

        // Get role from cookie as well
        const cookieRole = document.cookie
          .split("; ")
          .find(row => row.startsWith("role="))
          ?.split("=")[1];

        // Validate all auth data exists and matches
        const hasValidAuth = user && 
                           user.role && 
                           storedRole && 
                           token && 
                           user.role === storedRole &&
                           user.role === cookieRole;

        console.log("✅ Auth validation result:", {
          user: user || null,
          storedRole: storedRole || null,
          token: token ? "exists" : "missing",
          valid: hasValidAuth,
        });

        if (hasValidAuth) {
          const dashboardPath =
            user.role === "admin"
              ? "/admin-dashboard"
              : user.role === "seller"
              ? "/seller/dashboard"
              : "/buyer-dashboard";

          console.log("➡️ Already authenticated, redirecting to:", dashboardPath);
          navigate(dashboardPath, { replace: true });
        } else {
          // Only clear storage and redirect if we're not already on login page
          localStorage.clear();
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    };

    // Check auth only once on component mount
    if (!authChecked) {
      checkAuth();
      setAuthChecked(true);
    }
  }, [navigate]);

  if (!authChecked) return null;

  // ---- UI ----
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 pt-20 pb-10">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-200">
          <h1 className="text-4xl font-extrabold text-center text-green-800 mb-2">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-center text-gray-600 mb-8 capitalize">
            {isRegister
              ? `Register as ${currentRole || "user"}`
              : `Login ${currentRole ? `as ${currentRole}` : ""}`}
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
              <label className="mb-2 font-semibold text-gray-700">
                Password
              </label>
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
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition font-semibold"
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
