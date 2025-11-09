// DashboardOverview.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaBoxOpen, FaClipboardList, FaChartLine, FaBan } from "react-icons/fa";
import axios from "axios";
import PageContainer from "../../components/PageContainer";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalSpent: 0,
    cartItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const cartState = useSelector((state) => state.handleCart);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const token = storedUser?.token;

        if (!token) {
          console.warn("No token found. Please login.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/v1/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersData = response.data.orders || [];

        const totalOrders = ordersData.length;
        const pendingOrders = ordersData.filter(
          (order) => order.currentStatus?.status !== "Delivered" && order.currentStatus?.status !== "Cancelled"
        ).length;
        const cancelledOrders = ordersData.filter(
          (order) => order.currentStatus?.status === "Cancelled"
        ).length;
        const totalSpent = ordersData.reduce((acc, order) => acc + (order.total || 0), 0);

        setStats({
          totalOrders,
          pendingOrders,
          cancelledOrders,
          totalSpent,
          cartItems: cartState?.length || 0,
        });

        const sortedOrders = ordersData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentOrders(sortedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setStats({ totalOrders: 0, pendingOrders: 0, cancelledOrders: 0, totalSpent: 0, cartItems: cartState?.length || 0 });
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [cartState]);

  const StatCard = ({ icon, title, value, color, link }) => (
    <Link to={link} className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`text-3xl ${color.replace("border-l-4", "text")}`}>{icon}</div>
      </div>
    </Link>
  );

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-lg">Loading dashboard...</div>;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to Dashboard! 🛒</h1>
        <p className="text-green-100">Check your overall orders, cart, and stats here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={<FaClipboardList />}
          title="Total Orders"
          value={stats.totalOrders}
          color="border-l-4 border-blue-500 text-blue-500"
          link="/buyer-dashboard/orders"
        />
        <StatCard
          icon={<FaBoxOpen />}
          title="Pending Orders"
          value={stats.pendingOrders}
          color="border-l-4 border-yellow-500 text-yellow-500"
          link="/buyer-dashboard/orders"
        />
        <StatCard
          icon={<FaBan />}
          title="Cancelled Orders"
          value={stats.cancelledOrders}
          color="border-l-4 border-red-500 text-red-500"
          link="/buyer-dashboard/orders"
        />
        <StatCard
          icon={<FaShoppingCart />}
          title="Cart Items"
          value={stats.cartItems}
          color="border-l-4 border-green-500 text-green-500"
          link="/buyer-dashboard/cart"
        />
        <StatCard
          icon={<FaChartLine />}
          title="Total Spent"
          value={`₹${stats.totalSpent}`}
          color="border-l-4 border-purple-500 text-purple-500"
          link="/buyer-dashboard/orders"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/buyer-dashboard/products"
            className="flex items-center justify-center space-x-3 bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaBoxOpen className="text-xl" />
            <span className="font-semibold">Browse Products</span>
          </Link>
          <Link
            to="/buyer-dashboard/cart"
            className="flex items-center justify-center space-x-3 bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors relative"
          >
            <FaShoppingCart className="text-xl" />
            <span className="font-semibold">View Cart</span>
            {stats.cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {stats.cartItems}
              </span>
            )}
          </Link>
          <Link
            to="/buyer-dashboard/orders"
            className="flex items-center justify-center space-x-3 bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaClipboardList className="text-xl" />
            <span className="font-semibold">All Orders</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link to="/buyer-dashboard/orders" className="text-blue-500 hover:text-blue-600 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📦</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()} •{" "}
                        {order.products?.reduce((acc, p) => acc + (p.qty || 0), 0)} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹{order.total || 0}</p>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        order.currentStatus?.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.currentStatus?.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.currentStatus?.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link
            to="/buyer-dashboard/products"
            className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            <FaBoxOpen />
            <span>Start Shopping</span>
          </Link>
        </div>
      )}
      </div>
    </PageContainer>
  );
};

export default DashboardOverview;

