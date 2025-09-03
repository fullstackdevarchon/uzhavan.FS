// 🔐 Authentication Utilities
import Cookies from "js-cookie";

// 🔓 Secure Logout Function
export const logout = () => {
  console.log("🔓 Logging out user...");

  // Clear localStorage completely
  localStorage.clear();

  // Clear all authentication cookies using js-cookie
  Cookies.remove("token", { path: "/" });
  Cookies.remove("role", { path: "/" });

  // Verify cleanup
  console.log("✅ Logout complete:", {
    tokenCleared: !Cookies.get("token"),
    roleCleared: !Cookies.get("role"),
    localStorageCleared: !localStorage.getItem("user"),
    remainingCookies: document.cookie,
  });

  // Redirect to login page
  window.location.href = "/login/buyer";
};

// 🔍 Check Authentication Status
export const isAuthenticated = () => {
  const token = Cookies.get("token") || localStorage.getItem("token");
  const userRole = Cookies.get("role") || localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return token && user && userRole && user.role === userRole;
};

// 👤 Get Current User Info
export const getCurrentUser = () => {
  if (!isAuthenticated()) return null;
  return {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    role: Cookies.get("role") || localStorage.getItem("role"),
    token: Cookies.get("token") || localStorage.getItem("token"),
  };
};

// 🛡️ Role-based Access Control
export const hasRole = (requiredRole) => {
  const currentRole = Cookies.get("role") || localStorage.getItem("role");
  return currentRole === requiredRole;
};

// 🔄 Refresh Authentication
export const refreshAuth = () => {
  const token = Cookies.get("token") || localStorage.getItem("token");
  const role = Cookies.get("role") || localStorage.getItem("role");

  if (!token || !role) {
    logout();
    return false;
  }
  return true;
};
