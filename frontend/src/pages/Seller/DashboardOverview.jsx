import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaBoxOpen, FaClipboardCheck, FaChartLine } from "react-icons/fa";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalSales: 0,
    revenue: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/v1/products/seller",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const products = data.products || [];

        // Calculate total sold items and revenue
        let totalSold = 0;
        let revenue = 0;
        products.forEach((product) => {
          totalSold += product.sold || 0;
          revenue += (product.sold || 0) * (product.price || 0);
        });

        setStats({
          totalProducts: products.length,
          pendingOrders: 5, // Replace with real API if available
          totalSales: totalSold,
          revenue: revenue,
        });

        setRecentProducts(products.slice(0, 3));
      } else {
        console.error("Failed to fetch products:", response.status);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const StatCard = ({ icon, title, value, color, link }) => (
    <Link
      to={link}
      className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`text-3xl ${color.replace("border-l-4", "text")}`}>
          {icon}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard! 🌾</h1>
        <p className="text-orange-100">
          Manage your products and track your sales performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaBoxOpen />}
          title="Total Products"
          value={stats.totalProducts}
          color="border-l-4 border-blue-500 text-blue-500"
          link="/seller/my-products"
        />
        <StatCard
          icon={<FaClipboardCheck />}
          title="Pending Orders"
          value={stats.pendingOrders}
          color="border-l-4 border-yellow-500 text-yellow-500"
          link="/seller/check-status"
        />
        <StatCard
          icon={<FaChartLine />}
          title="Total Sales"
          value={stats.totalSales}
          color="border-l-4 border-green-500 text-green-500"
          link="/seller/check-status"
        />
        <StatCard
          icon={<FaChartLine />}
          title="Revenue"
          value={`₹${stats.revenue}`}
          color="border-l-4 border-purple-500 text-purple-500"
          link="/seller/check-status"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/seller/add-product"
            className="flex items-center justify-center space-x-3 bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlusCircle className="text-xl" />
            <span className="font-semibold">Add New Product</span>
          </Link>
          <Link
            to="/seller/my-products"
            className="flex items-center justify-center space-x-3 bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaBoxOpen className="text-xl" />
            <span className="font-semibold">View My Products</span>
          </Link>
          <Link
            to="/seller/check-status"
            className="flex items-center justify-center space-x-3 bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaClipboardCheck className="text-xl" />
            <span className="font-semibold">Check Status</span>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      {recentProducts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Products</h2>
            <Link
              to="/seller/my-products"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProducts.map((product) => (
              <div key={product._id} className="border rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-200 flex items-center justify-center">
                  {product.image?.url ? (
                    <img
                      src={product.image.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">📦</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-green-600 font-bold">₹{product.price}</p>
                  <p className="text-gray-500 text-sm">
                    {product.category
                      ? typeof product.category === "string"
                        ? product.category
                        : product.category.name || "Uncategorized"
                      : "Uncategorized"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Empty State
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Yet</h3>
          <p className="text-gray-500 mb-6">Start your selling journey by adding your first product</p>
          <Link
            to="/seller/add-product"
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            <FaPlusCircle />
            <span>Add Your First Product</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
