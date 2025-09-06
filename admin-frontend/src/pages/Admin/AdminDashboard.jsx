import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxes,
  FaUserCog,
  FaChartBar,
  FaWarehouse,
  FaShoppingCart,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingSellers: 0,
    totalRevenue: 0,
    inventoryItems: 0,
    totalOrders: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard-stats",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ attach token
            },
            credentials: "include", // ✅ in case backend uses cookies
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Unauthorized. Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const dashboardCards = [
    {
      title: "Products",
      count: stats.totalProducts,
      icon: FaBoxes,
      link: "/admin-dashboard/products",
      color: "blue",
      description: "Total products in inventory",
    },
    {
      title: "Pending Sellers",
      count: stats.pendingSellers,
      icon: FaUserCog,
      link: "/admin-dashboard/seller-requests",
      color: "purple",
      description: "Sellers awaiting approval",
    },
    {
      title: "Revenue",
      count: `₹${stats.totalRevenue}`,
      icon: FaChartBar,
      link: "/admin-dashboard/analytics",
      color: "green",
      description: "Total revenue generated",
    },
    {
      title: "Inventory",
      count: stats.inventoryItems,
      icon: FaWarehouse,
      link: "/admin-dashboard/inventory",
      color: "yellow",
      description: "Items in stock",
    },
    {
      title: "Orders",
      count: stats.totalOrders,
      icon: FaShoppingCart,
      link: "/admin-dashboard/orders",
      color: "red",
      description: "Total orders received",
    },
    {
      title: "Active Users",
      count: stats.activeUsers,
      icon: FaUsers,
      link: "/admin-dashboard/users",
      color: "indigo",
      description: "Currently active users",
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`p-6 rounded-lg shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg bg-white border-t-4 border-${card.color}-500`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  {card.title}
                </h2>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {card.count}
                </p>
                <p className="mt-2 text-sm text-gray-500">{card.description}</p>
              </div>
              <card.icon className={`text-${card.color}-500 text-3xl`} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
