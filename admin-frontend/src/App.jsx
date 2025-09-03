// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminNavbar from "./pages/Admin/AdminNavbar";
import ProductListAdmin from "./pages/Admin/ProductList";
import SellerRequests from "./pages/Admin/SellerRequests";
import Analytics from "./pages/Admin/Analytics";
import Inventory from "./pages/Admin/Inventory";
import Orders from "./pages/Admin/Orders";

// Common Components
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

// Admin Role Validator for Login
function AdminLoginCheck() {
  const { role } = useParams();
  
  // Ensure only admin role is allowed
  if (role !== "admin") {
    return <Navigate to="/login/admin" replace />;
  }
  return <Login />;
}

// Protected Route for Admin Only
function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Strict validation for admin role
  const isAdminAuthenticated = 
    token && 
    user && 
    userRole === "admin" && 
    user.role === "admin";

  console.log("Admin Auth Status:", { 
    isAuthenticated: isAdminAuthenticated, 
    role: userRole,
    hasToken: !!token 
  });

  if (!isAdminAuthenticated) {
    // Clear auth data if not admin or not authenticated
    localStorage.clear();
    Cookies.remove("token");
    Cookies.remove("role");
    return <Navigate to="/login/admin" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Redirect root to admin login */}
        <Route path="/" element={<Navigate to="/login/admin" replace />} />

        {/* Admin Login */}
        <Route path="/login" element={<Navigate to="/login/admin" replace />} />
        <Route path="/login/:role" element={<AdminLoginCheck />} />

        {/* Admin Dashboard & Features */}
        <Route
          path="/admin-dashboard/*"
          element={
            <AdminProtectedRoute>
              <div className="flex flex-col min-h-screen bg-gray-50">
                <AdminNavbar />
                <div className="flex-grow p-6">
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="products" element={<ProductListAdmin />} />
                    <Route path="seller-requests" element={<SellerRequests />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </div>
              </div>
            </AdminProtectedRoute>
          }
        />

        {/* Catch all other routes and redirect to admin login */}
        <Route path="*" element={<Navigate to="/login/admin" replace />} />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
