import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaShoppingCart,
  FaBoxOpen,
  FaClipboardList,
  FaChartLine,
  FaBan,
} from "react-icons/fa";
import axios from "axios";
import PageContainer from "../../components/PageContainer";
import Preloader from "../../components/Preloader";

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
          (order) =>
            order.currentStatus?.status !== "Delivered" &&
            order.currentStatus?.status !== "Cancelled"
        ).length;

        const cancelledOrders = ordersData.filter(
          (order) => order.currentStatus?.status === "Cancelled"
        ).length;

        const totalSpent = ordersData.reduce(
          (acc, order) => acc + (order.total || 0),
          0
        );

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
        setStats({
          totalOrders: 0,
          pendingOrders: 0,
          cancelledOrders: 0,
          totalSpent: 0,
          cartItems: cartState?.length || 0,
        });
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [cartState]);

  // StatCard Component (Glass UI)
  const StatCard = ({ icon, title, value, color, link }) => (
    <Link
      to={link}
      className={`backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-2xl p-6 
      hover:scale-[1.02] transition-all duration-300 cursor-pointer glass-card ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-extrabold text-white drop-shadow mt-1">
            {value}
          </p>
        </div>
        <div className="text-4xl text-white/90">{icon}</div>
      </div>
    </Link>
  );

  if (loading) {
    return <Preloader />;
  }

  return (
    <PageContainer>
      <div className="space-y-8 animate-fadeIn bg-cover bg-center min-h-screen p-4"
          //  style={{ backgroundImage: "url('/assets/bg.jpg')" }}
          >

        {/* Header Section */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 
                        text-white rounded-2xl p-6 shadow-2xl">
          <h1 className="text-4xl font-bold drop-shadow">Welcome to Dashboard ✨</h1>
          <p className="text-white/80 mt-1">
            Track your orders, cart and total spending all in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon={<FaClipboardList />}
            title="Total Orders"
            value={stats.totalOrders}
            color="border-blue-300"
            link="/buyer-dashboard/orders"
          />
          <StatCard
            icon={<FaBoxOpen />}
            title="Pending Orders"
            value={stats.pendingOrders}
            color="border-yellow-300"
            link="/buyer-dashboard/orders"
          />
          <StatCard
            icon={<FaBan />}
            title="Cancelled"
            value={stats.cancelledOrders}
            color="border-red-300"
            link="/buyer-dashboard/orders"
          />
          <StatCard
            icon={<FaShoppingCart />}
            title="Cart Items"
            value={stats.cartItems}
            color="border-green-300"
            link="/buyer-dashboard/cart"
          />
          <StatCard
            icon={<FaChartLine />}
            title="Total Spent"
            value={`₹${stats.totalSpent}`}
            color="border-purple-300"
            link="/buyer-dashboard/orders"
          />
        </div>

        {/* Quick Actions */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Actions ⚡</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/buyer-dashboard/products"
              className="glass-btn bg-green-500/60 hover:bg-green-500 text-white p-4 rounded-2xl flex justify-center items-center space-x-3 transition-all"
            >
              <FaBoxOpen className="text-xl" />
              <span className="font-semibold">Browse Products</span>
            </Link>

            <Link
              to="/buyer-dashboard/cart"
              className="glass-btn bg-blue-500/60 hover:bg-blue-500 text-white p-4 rounded-2xl flex justify-center items-center space-x-3 transition-all relative"
            >
              <FaShoppingCart className="text-xl" />
              <span className="font-semibold">View Cart</span>

              {stats.cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                  {stats.cartItems}
                </span>
              )}
            </Link>

            <Link
              to="/buyer-dashboard/orders"
              className="glass-btn bg-orange-500/60 hover:bg-orange-500 text-white p-4 rounded-2xl flex justify-center items-center space-x-3 transition-all"
            >
              <FaClipboardList className="text-xl" />
              <span className="font-semibold">All Orders</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Orders 📦</h2>
            <Link to="/buyer-dashboard/orders" className="text-blue-300 hover:text-blue-400 font-semibold">
              View All →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-white">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-white/80 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()} •{" "}
                        {order.products?.reduce(
                          (acc, p) => acc + (p.qty || 0),
                          0
                        )}{" "}
                        items
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-white">₹{order.total || 0}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          order.currentStatus?.status === "Delivered"
                            ? "bg-green-500/50"
                            : order.currentStatus?.status === "Cancelled"
                            ? "bg-red-500/50"
                            : "bg-yellow-500/50"
                        }`}
                      >
                        {order.currentStatus?.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-6xl mb-4">🛒</p>
              <h3 className="text-xl font-semibold text-white/90">
                No Recent Orders
              </h3>
              <p className="text-white/70 mb-4">
                Start shopping to see your orders here.
              </p>
              <Link
                to="/buyer-dashboard/products"
                className="glass-btn bg-green-500/60 px-6 py-3 rounded-xl text-white hover:bg-green-500"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardOverview;
