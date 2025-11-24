import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import LabourNavbar from "./pages/Labour/LabourNavbar";
import Login from "./pages/Auth/Login";
import OrderList from "./pages/Labour/OrderList";
import MyOrders from "./pages/Labour/MyOrders";
import { Toaster } from "react-hot-toast";
import Preloader from "./components/Preloader"; // ✅ import Preloader

export const AuthContext = createContext(null);

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const [showPreloader, setShowPreloader] = useState(true); // ✅ Preloader state

  // Function to validate token on app load
  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthState({ isAuthenticated: false, user: null, loading: false });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/verify`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthState({
          isAuthenticated: true,
          user: data.user || {},
          loading: false,
        });
      } else {
        localStorage.removeItem("token");
        setAuthState({ isAuthenticated: false, user: null, loading: false });
      }
    } catch (error) {
      console.error("Token validation error:", error);
      localStorage.removeItem("token");
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    }
  };

  useEffect(() => {
    // Delay validation until preloader completes
    const timer = setTimeout(() => {
      setShowPreloader(false);
      validateToken();
    }, 3500); // wait 3.5 seconds before loading app content
    return () => clearTimeout(timer);
  }, []);

  const login = (userData, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setAuthState({
      isAuthenticated: true,
      user: userData,
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

  // ✅ Show Preloader first
  if (showPreloader) {
    return <Preloader />;
  }

  // ✅ Show loading spinner while validating token
  if (authState.loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent"></div>
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
              <Navigate to="/labour-dashboard/order-list" />
            ) : (
              <Login />
            )
          }
        />

        {/* Labour Dashboard Routes */}
        <Route
          path="/labour-dashboard/*"
          element={
            authState.isAuthenticated ? (
              <LabourNavbar />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {/* Default under navbar -> Order List */}
          <Route index element={<Navigate to="order-list" replace />} />
          <Route path="order-list" element={<OrderList mode="take" />} />
          <Route path="my-orders" element={<MyOrders />} />
        </Route>

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h1 className="text-6xl font-bold text-gray-900">404</h1>
              <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="mt-8 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
