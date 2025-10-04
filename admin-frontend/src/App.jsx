import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import AdminNavbar from "./pages/Admin/AdminNavbar";
import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SelectedProducts from "./pages/Admin/SelectedProducts";
import ProductList from "./pages/Admin/ProductList";
import Orders from "./pages/Admin/Orders";
import Analytics from "./pages/Admin/Analytics";
import Inventory from "./pages/Admin/Inventory";
import SellerRequests from "./pages/Admin/SellerRequests";
import AddLabour from "./pages/Admin/AddLabour"; // ✅ new
import LabourList from "./pages/Admin/LabourList"; // ✅ new
import LabourOrders from "./pages/Admin/LabourOrders"; // ✅ new
import { Toaster } from "react-hot-toast";

export const AuthContext = createContext(null);

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthState({ isAuthenticated: true, user: {}, loading: false });
    } else {
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    setAuthState({
      isAuthenticated: true,
      user: userData.user,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  if (authState.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      <Toaster position="top-right" />
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login route */}
        <Route
          path="/login"
          element={
            authState.isAuthenticated ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Login />
            )
          }
        />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard/*"
          element={
            authState.isAuthenticated ? (
              <AdminNavbar />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<SelectedProducts />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="seller-requests" element={<SellerRequests />} />

          {/* ✅ Delivery Routes */}
          <Route path="delivery/add-labour" element={<AddLabour />} />
          <Route path="delivery/labour-list" element={<LabourList />} />
          <Route path="delivery/labour-orders" element={<LabourOrders />} />
        </Route>

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center">
              <h1 className="text-6xl font-bold text-gray-900">404</h1>
              <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="mt-8 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Back to Login
              </button>
            </div>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
