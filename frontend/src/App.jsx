// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useParams, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
        <Route path="/admin-dashboard/*" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <div>
              <AdminNavbar />
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="products" element={<ProductListAdmin />} />
                <Route path="seller-requests" element={<SellerRequests />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="orders" element={<Orders />} />
              </Routes>
            </div>
          </ProtectedRoute>
        } />// Public Pages
import { Home, Product, Products, AboutPage, ContactPage, Cart, PageNotFound } from "./pages";

// Login
import Login from "./pages/Login";

// Buyer Nested Pages
import ProductList from "./pages/BUYER/ProductList";
import OrderList from "./pages/BUYER/OrderList";
import CartPage from "./pages/BUYER/CartPage";
import Checkout from "./pages/BUYER/Checkout";
import BuyerProduct from "./pages/BUYER/Product";
import BuyerNavbar from "./pages/BUYER/Buyernavber";

// Seller Nested Pages
import SellerNavbar from "./pages/Seller/selernavbar";
import AddProduct from "./pages/Seller/AddProduct";
import CheckStatus from "./pages/Seller/CheckStatus";
import MyProducts from "./pages/Seller/MyProducts";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminNavbar from "./pages/Admin/AdminNavbar";
import ProductListAdmin from "./pages/Admin/ProductList";
import SellerRequests from "./pages/Admin/SellerRequests";
import Analytics from "./pages/Admin/Analytics";
import Inventory from "./pages/Admin/Inventory";
import Orders from "./pages/Admin/Orders";

// Utils
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

// ✅ Wrapper to validate login role in URL
function LoginWithRole() {
  const { role } = useParams();
  const validRoles = ["buyer", "seller", "admin"];
  if (!validRoles.includes(role)) {
    // return <Navigate to="/login/buyer" replace />;
  }
  return <Login />;
}

// ✅ Protected Route Wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token"); // Get token from localStorage instead
  const userRole = localStorage.getItem("role"); // Get role from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAuthenticated = token && user && userRole && user.role === userRole;
  console.log("Auth Status:", { isAuthenticated, token: !!token, user: !!user, userRole });

  if (!isAuthenticated) {
    // Clear all auth data if not authenticated
    localStorage.clear();
    Cookies.remove("token");
    Cookies.remove("role");
    return <Navigate to={`/login/${userRole || 'buyer'}`} replace />;
  }

  // Check if user has permission for this route
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log("Role not allowed:", { userRole, allowedRoles });
    // Redirect to appropriate dashboard
    const dashPath = {
      admin: "/admin-dashboard",
      seller: "/seller/dashboard",
      buyer: "/buyer-dashboard"
    }[userRole];
    return <Navigate to={dashPath} replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<Cart />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Navigate to="/login/buyer" replace />} />
        <Route path="/login/:role" element={<LoginWithRole />} />
        <Route path="/register" element={<Navigate to="/login/buyer" replace />} />

        {/* Buyer Dashboard */}
        <Route
          path="/buyer-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerNavbar />
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProductList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<BuyerProduct />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* Seller Dashboard */}
        <Route
          path="/seller/*"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerNavbar />
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AddProduct />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="my-products" element={<MyProducts />} />
          <Route path="check-status" element={<CheckStatus />} />
        </Route>

        {/* Admin Dashboard & Features */}
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <div className="flex flex-col min-h-screen">
                <AdminNavbar />
                <div className="flex-grow">
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="products" element={<ProductListAdmin />} />
                    <Route path="seller-requests" element={<SellerRequests />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="orders" element={<Orders />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
