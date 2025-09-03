import React from "react";
import { Routes, Route, Navigate, useParams, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

// Pages
import { Home, Product, Products, AboutPage, ContactPage, Cart, PageNotFound } from "./pages";
import Login from "./pages/Login";

// Buyer
import ProductList from "./pages/BUYER/ProductList";
import OrderList from "./pages/BUYER/OrderList";
import CartPage from "./pages/BUYER/CartPage";
import Checkout from "./pages/BUYER/Checkout";
import BuyerProduct from "./pages/BUYER/Product";
import BuyerNavbar from "./pages/BUYER/Buyernavber";

// Seller
import SellerNavbar from "./pages/Seller/selernavbar";
import AddProduct from "./pages/Seller/AddProduct";
import CheckStatus from "./pages/Seller/CheckStatus";
import MyProducts from "./pages/Seller/MyProducts";

// Utils
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

function LoginWithRole() {
  const { role } = useParams();
  const validRoles = ["buyer", "seller"];
  if (!validRoles.includes(role)) return <Navigate to="/login/buyer" replace />;
  return <Login />;
}

// ✅ Authentication Hook
function useAuth() {
  const token = Cookies.get("token") || localStorage.getItem("token");
  const userRole = Cookies.get("role") || localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  console.log("🔍 Auth Debug:", {
    tokenSource: Cookies.get("token") ? "cookie" : (localStorage.getItem("token") ? "localStorage" : "missing"),
    roleSource: Cookies.get("role") ? "cookie" : (localStorage.getItem("role") ? "localStorage" : "missing"),
    user: user ? user.fullName : "missing",
    tokenPreview: token ? token.substring(0, 15) + "..." : "missing",
    allCookies: document.cookie,
  });

  const isAuthenticated = !!(token && user && userRole && user.role === userRole);

  return { isAuthenticated, user, userRole, token };
}

// ✅ Protected Route
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to login");
    localStorage.clear();
    Cookies.remove("token");
    Cookies.remove("role");
    return <Navigate to="/login/buyer" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log("⚠️ Role not allowed, redirecting...");
    const dashPath = userRole === "seller" ? "/seller/dashboard" : "/buyer-dashboard";
    return <Navigate to={dashPath} replace />;
  }

  return children;
}

// ✅ Default redirect
function AuthRedirect() {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login/buyer" replace />;
  return <Navigate to={userRole === "seller" ? "/seller/dashboard" : "/buyer-dashboard"} replace />;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AuthRedirect />} />

        {/* Public */}
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<Cart />} />

        {/* Auth */}
        <Route path="/login" element={<Navigate to="/login/buyer" replace />} />
        <Route path="/login/:role" element={<LoginWithRole />} />
        <Route path="/register" element={<Navigate to="/login/buyer" replace />} />

        {/* Buyer */}
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

        {/* Seller */}
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

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
