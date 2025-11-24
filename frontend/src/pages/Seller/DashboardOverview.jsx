import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaPlusCircle,
  FaBoxOpen,
  FaClipboardCheck,
  FaChartLine,
} from "react-icons/fa";
import { io } from "socket.io-client";
import PageContainer from "../../components/PageContainer";
import Preloader from "../../components/Preloader";

// Socket
const socket = io("http://localhost:5000");

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalSales: 0,
    revenue: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sellerId = localStorage.getItem("userId");

    if (sellerId) {
      socket.emit("joinRoom", { id: sellerId, role: "seller" });

      socket.on("receiveNotification", (data) => {
        toast.success(`${data.title}: ${data.message}`);
      });
    }

    fetchDashboardData();

    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  // Fetch Stats
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/v1/products/seller", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return toast.error("Failed to load dashboard data");

      const data = await res.json();
      const products = data.products || [];

      let totalSold = 0;
      let revenue = 0;

      products.forEach((p) => {
        totalSold += p.sold || 0;
        revenue += (p.sold || 0) * (p.price || 0);
      });

      setStats({
        totalProducts: products.length,
        pendingOrders: 5,
        totalSales: totalSold,
        revenue,
      });

      setRecentProducts(products.slice(0, 3));
    } catch (err) {
      toast.error("Error fetching dashboard data");
    } finally {
      setTimeout(() => setLoading(false), 1200);
    }
  };

  // Stat Card
  const StatCard = ({ icon, title, value, color, link }) => (
    <Link
      to={link}
      className="
        backdrop-blur-xl bg-white/10 border border-white/20 
        text-white rounded-2xl p-6 shadow-2xl transition-all
        hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`text-4xl ${color}`}>{icon}</div>
      </div>
    </Link>
  );

  if (loading) return <Preloader />;

  return (
    <PageContainer>
      <div
        className="
          min-h-screen p-6 
          bg-fixed bg-cover bg-center 
        "
        // style={{
        //   backgroundImage: "url('/assets/IMG-20251013-WA0000.jpg')",
        // }}
      >
        <div className="space-y-10">

          {/* WELCOME SECTION */}
          <div
            className="
              backdrop-blur-xl bg-white/10 border border-white/20
              text-white rounded-2xl p-10 shadow-2xl
              hover:bg-white/20 transition-all hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]
            "
          >
            <h1 className="text-4xl font-extrabold mb-2">
              Welcome to Your Dashboard! 🌾
            </h1>
            <p className="text-white/80 text-lg">
              Manage your products and track your sales performance.
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<FaBoxOpen />}
              title="Total Products"
              value={stats.totalProducts}
              color="text-blue-300"
              link="/seller/my-products"
            />

            <StatCard
              icon={<FaClipboardCheck />}
              title="Pending Orders"
              value={stats.pendingOrders}
              color="text-yellow-300"
              link="/seller/check-status"
            />

            <StatCard
              icon={<FaChartLine />}
              title="Total Sales"
              value={stats.totalSales}
              color="text-green-300"
              link="/seller/check-status"
            />

            <StatCard
              icon={<FaChartLine />}
              title="Revenue"
              value={`₹${stats.revenue}`}
              color="text-purple-300"
              link="/seller/check-status"
            />
          </div>

          {/* QUICK ACTIONS */}
          <div
            className="
              backdrop-blur-xl bg-white/10 border border-white/20 
              text-white rounded-2xl p-6 shadow-2xl
            "
          >
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <Link
                to="/seller/add-product"
                className="
                  flex items-center justify-center gap-3
                  backdrop-blur-xl bg-blue-600/40 border border-blue-300/30
                  text-white p-4 rounded-xl font-semibold
                  hover:bg-blue-600/60 hover:scale-105 transition-all
                "
              >
                <FaPlusCircle className="text-xl" /> Add New Product
              </Link>

              <Link
                to="/seller/my-products"
                className="
                  flex items-center justify-center gap-3
                  backdrop-blur-xl bg-green-600/40 border border-green-300/30
                  text-white p-4 rounded-xl font-semibold
                  hover:bg-green-600/60 hover:scale-105 transition-all
                "
              >
                <FaBoxOpen className="text-xl" /> View My Products
              </Link>

              <Link
                to="/seller/check-status"
                className="
                  flex items-center justify-center gap-3
                  backdrop-blur-xl bg-orange-600/40 border border-orange-300/30
                  text-white p-4 rounded-xl font-semibold
                  hover:bg-orange-600/60 hover:scale-105 transition-all
                "
              >
                <FaClipboardCheck className="text-xl" /> Check Status
              </Link>

            </div>
          </div>

          {/* RECENT PRODUCTS */}
          {recentProducts.length > 0 ? (
            <div
              className="
                backdrop-blur-xl bg-white/10 border border-white/20 
                text-white rounded-2xl p-6 shadow-2xl
              "
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Products</h2>

                <Link
                  to="/seller/my-products"
                  className="text-blue-300 hover:text-blue-400 font-semibold"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentProducts.map((product) => (
                  <div
                    key={product._id}
                    className="
                      backdrop-blur-xl bg-white/10 border border-white/20
                      rounded-xl overflow-hidden shadow-xl
                      hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]
                      transition-all
                    "
                  >
                    {/* IMAGE */}
                    <div className="h-40 bg-black/20 flex items-center justify-center">
                      {product.image?.url ? (
                        <img
                          src={product.image.url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white/60 text-4xl">📦</span>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="p-4">
                      <h3 className="font-semibold text-white truncate">
                        {product.name}
                      </h3>

                      <p className="text-green-300 font-bold">
                        ₹{product.price}
                      </p>

                      <p className="text-white/70 text-sm">
                        {product?.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="
                backdrop-blur-xl bg-white/10 border border-white/20 
                text-white rounded-2xl p-10 shadow-xl text-center
              "
            >
              <div className="text-white/40 text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold mb-2">No Products Yet</h3>
              <p className="text-white/70 mb-6">
                Add your first product to get started.
              </p>

              <Link
                to="/seller/add-product"
                className="
                  backdrop-blur-xl bg-orange-600/40 border border-orange-300/30
                  text-white px-6 py-3 rounded-xl font-semibold
                  hover:bg-orange-600/60 hover:scale-105 transition-all
                "
              >
                <FaPlusCircle className="inline mr-2" />
                Add Your First Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardOverview;
