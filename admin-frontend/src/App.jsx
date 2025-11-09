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
import AddLabour from "./pages/Admin/AddLabour";
import LabourList from "./pages/Admin/LabourList";
import LabourOrders from "./pages/Admin/LabourOrders";
import { Toaster, toast } from "react-hot-toast";
import { socket, joinRoom } from "./socket";

export const AuthContext = createContext(null);

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (token) {
      setAuthState({ isAuthenticated: true, user, loading: false });
      if (user.role) joinRoom(user.role);
    } else {
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    }

    if (Notification.permission !== "granted") Notification.requestPermission();

    const subscribePush = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register("/service-worker.js");
          const existingSubscription = await registration.pushManager.getSubscription();

          if (!existingSubscription) {
            const response = await fetch("http://localhost:5000/api/notifications/vapid-key");
            const { publicKey } = await response.json();

            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey),
            });

            await fetch("http://localhost:5000/api/notifications/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(subscription),
            });

            console.log("✅ Push subscription successful", subscription);
          }
        } catch (err) {
          console.error("❌ Push subscription failed:", err);
        }
      }
    };

    subscribePush();

    socket.on("receiveNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      toast.success(`${data.title} - ${data.message}`, { duration: 5000 });

      if (Notification.permission === "granted") {
        new Notification(data.title, { body: data.message, icon: "/icon.png" });
      }

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== data));
      }, 5000);
    });

    return () => socket.off("receiveNotification");
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
    setAuthState({ isAuthenticated: true, user: userData.user, loading: false });
    if (userData.user.role) joinRoom(userData.user.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({ isAuthenticated: false, user: null, loading: false });
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
          element={authState.isAuthenticated ? <Navigate to="/admin-dashboard" /> : <Login />}
        />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard/*"
          element={
            authState.isAuthenticated ? (
              <div className="flex flex-col min-h-screen">
                <AdminNavbar />
                {/* ✅ NotificationBell removed */}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<AdminDashboard notifications={notifications} />} />
          <Route path="categories" element={<SelectedProducts />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="seller-requests" element={<SellerRequests />} />

          {/* Delivery Routes */}
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

/* ===== Utility Function: convert VAPID key ===== */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
