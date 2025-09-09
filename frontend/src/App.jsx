import React from "react";
import { Routes, Route, Navigate, useParams, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

// Pages
import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  PageNotFound,
} from "./pages";
import Login from "./pages/Login";

// Buyer
import ProductList from "./pages/BUYER/ProductList";
import OrderList from "./pages/BUYER/OrderList";
import CartPage from "./pages/BUYER/CartPage";
import Checkout from "./pages/BUYER/Checkout";
import BuyerProduct from "./pages/BUYER/Product";
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerDashboardOverview from "./pages/BUYER/DashboardOverview";
import Profile from "./pages/BUYER/Profile"; // ✅ Profile page

// Seller
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/Seller/AddProduct";
import CheckStatus from "./pages/Seller/CheckStatus";
import MyProducts from "./pages/Seller/MyProducts";
import SellerDashboardOverview from "./pages/Seller/DashboardOverview";

// Utils
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

// ------------------------
// Role-based Login Route
// ------------------------
function LoginWithRole() {
  const { role } = useParams();
  const validRoles = ["buyer", "seller"];
  if (!validRoles.includes(role)) return <Navigate to="/login/buyer" replace />;
  return <Login />;
}

// ------------------------
// Authentication Hook
// ------------------------
function useAuth() {
  const token = Cookies.get("token") || localStorage.getItem("token");
  const userRole = Cookies.get("role") || localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAuthenticated = !!(
    token &&
    user &&
    userRole &&
    user.role === userRole
  );

  return { isAuthenticated, user, userRole, token };
}

// ------------------------
// Protected Route
// ------------------------
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    localStorage.clear();
    Cookies.remove("token");
    Cookies.remove("role");
    return <Navigate to="/login/buyer" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const dashPath =
      userRole === "seller" ? "/seller/dashboard" : "/buyer-dashboard";
    return <Navigate to={dashPath} replace />;
  }

  return children;
}

// ------------------------
// Default redirect
// ------------------------
function AuthRedirect() {
  const { isAuthenticated, userRole } = useAuth();

  // Uncomment to auto-redirect logged-in users to dashboard
  // if (isAuthenticated) {
  //   return (
  //     <Navigate
  //       to={userRole === "seller" ? "/seller/dashboard" : "/buyer-dashboard"}
  //       replace
  //     />
  //   );
  // }

  return <Home />;
}

// ------------------------
// App Component
// ------------------------
function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Default page */}
        <Route path="/" element={<AuthRedirect />} />

        {/* Public Pages */}
        <Route path="/home" element={<Home />} />
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
          path="/buyer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<BuyerDashboardOverview />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<BuyerProduct />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} /> {/* ✅ Profile */}
        </Route>

        {/* Seller Dashboard */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerDashboardOverview />} />
          <Route path="dashboard" element={<SellerDashboardOverview />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="my-products" element={<MyProducts />} />
          <Route path="check-status" element={<CheckStatus />} />
          <Route path="profile" element={<Profile />} /> {/* ✅ Profile */}
        </Route>

        {/* Redirect old seller dashboard route */}
        <Route path="/seller/dashboard" element={<Navigate to="/seller" replace />} />

        {/* Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
