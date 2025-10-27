// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxes,
  FaUserCog,
  FaChartBar,
  FaWarehouse,
  FaShoppingCart,
  FaUsers,
  FaUserTag,
  FaUserFriends,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// ======== Connect Socket.IO once ========
let socket;
if (!window.socket) {
  socket = io("http://localhost:5000", {
    transports: ["websocket"],
    withCredentials: true,
  });
  window.socket = socket;
} else {
  socket = window.socket;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingSellers: 0,
    totalRevenue: 0,
    inventoryItems: 0,
    totalOrders: 0,
    activeBuyers: 0,
    activeSellers: 0,
    totalActiveUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // ============================
  // Dashboard Stats Loader
  // ============================
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token missing");

        // Fetch products
        const productRes = await fetch("http://localhost:5000/api/v1/products/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productData = await productRes.json();
        const products = productData.products || [];

        const totalProducts = products.length;
        const pendingSellers = products.filter((p) => p.status === "pending").length;
        const inventoryItems = products.reduce((acc, p) => acc + (p.quantity || 0), 0);
        const totalRevenue = products.reduce(
          (acc, p) => acc + ((p.sold || 0) * (p.price || 0)),
          0
        );

        // Fetch orders
        const ordersRes = await fetch("http://localhost:5000/api/v1/orders/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await ordersRes.json();
        const deliveredOrders =
          ordersData.orders?.filter((o) => o.currentStatus?.status === "Delivered").length || 0;

        // Fetch users
        const usersRes = await fetch("http://localhost:5000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        const users = Array.isArray(usersData) ? usersData : usersData.users || [];
        const buyers = users.filter((u) => u.role === "buyer");
        const sellers = users.filter((u) => u.role === "seller");

        setStats({
          totalProducts,
          pendingSellers,
          totalRevenue,
          inventoryItems,
          totalOrders: deliveredOrders,
          activeBuyers: buyers.length,
          activeSellers: sellers.length,
          totalActiveUsers: buyers.length + sellers.length,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // ============================
  // Socket.IO Setup
  // ============================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role === "admin") {
      socket.emit("joinRoom", { id: user._id, role: "admin" });
      console.log("🟢 Admin joined room");
    }

    // Listen for notifications
    socket.on("receiveNotification", (data) => {
      console.log("📨 Notification received:", data);
      setNotifications((prev) => [data, ...prev]);
      toast.success(`${data.title} - ${data.message}`, { duration: 5000 });
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  // ============================
  // Dashboard cards setup
  // ============================
  const dashboardCards = [
    {
      title: "Total Active Users",
      count: stats.totalActiveUsers,
      icon: FaUserFriends,
      link: "/admin-dashboard/users",
      color: "from-orange-400 to-pink-500",
      description: "All active users (excluding admins)",
    },
    {
      title: "Products",
      count: stats.totalProducts,
      icon: FaBoxes,
      link: "/admin-dashboard/products",
      color: "from-blue-400 to-indigo-500",
      description: "Total products listed",
    },
    {
      title: "Pending Seller Requests",
      count: stats.pendingSellers,
      icon: FaUserCog,
      link: "/admin-dashboard/seller-requests",
      color: "from-purple-400 to-fuchsia-500",
      description: "Sellers awaiting approval",
    },
    {
      title: "Revenue",
      count: `₹${stats.totalRevenue}`,
      icon: FaChartBar,
      link: "/admin-dashboard/analytics",
      color: "from-emerald-400 to-green-500",
      description: "Total revenue",
    },
    {
      title: "Inventory",
      count: stats.inventoryItems,
      icon: FaWarehouse,
      link: "/admin-dashboard/inventory",
      color: "from-yellow-400 to-amber-500",
      description: "Available stock only (quantity > 0)",
    },
    {
      title: "Delivered Orders",
      count: stats.totalOrders,
      icon: FaShoppingCart,
      link: "/admin-dashboard/orders",
      color: "from-rose-400 to-red-500",
      description: "Delivered orders count",
    },
    {
      title: "Active Buyers",
      count: stats.activeBuyers,
      icon: FaUsers,
      link: "/admin-dashboard/users/buyers",
      color: "from-teal-400 to-cyan-500",
      description: "Total registered buyers",
    },
    {
      title: "Active Sellers",
      count: stats.activeSellers,
      icon: FaUserTag,
      link: "/admin-dashboard/users/sellers",
      color: "from-indigo-400 to-blue-500",
      description: "Total registered sellers",
    },
  ];

  // ============================
  // Loading Screen
  // ============================
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-3" />
        <p className="text-gray-600 text-lg font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  // ============================
  // Main Dashboard UI
  // ============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Welcome back, <span className="font-medium text-indigo-600">Admin</span> 👋
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            Last updated: <span className="font-medium text-gray-700">{new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="group relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 rounded-2xl transition duration-300`}
              ></div>
              <div className="relative flex items-start justify-between z-10">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-white">{card.title}</h2>
                  <p className="mt-2 text-3xl font-bold text-gray-900 group-hover:text-white">{card.count}</p>
                  <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-100">{card.description}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-white/20">
                  <card.icon className="text-3xl text-gray-600 group-hover:text-white transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Notifications List */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Recent Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications yet.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n, index) => (
                <li
                  key={index}
                  className="border p-3 rounded-lg bg-white shadow-sm text-gray-800"
                >
                  <b>{n.title}</b>: {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
