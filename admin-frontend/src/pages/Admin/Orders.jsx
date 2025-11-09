// src/pages/Admin/Orders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTruck, FaClipboardList, FaUser, FaSearch, FaFilter } from "react-icons/fa";
import PageContainer from "../../components/PageContainer";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/v1/orders/admin/all",
          { withCredentials: true } // ✅ if using cookies/JWT
        );
        setOrders(res.data.orders || []); // assuming API returns { orders: [...] }
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 🔍 Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const customerName =
      order?.address?.fullName?.toLowerCase() || "unknown customer";
    const productsList = order?.products
      ?.map((p) => p?.product?.name || "unknown product")
      .join(", ")
      .toLowerCase();

    const matchesSearch =
      customerName.includes(search.toLowerCase()) ||
      productsList.includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ? true : order.status === filter;

    return matchesSearch && matchesFilter;
  });

  // 🎨 Status Color Mapping
  const statusClasses = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Confirmed: "bg-indigo-100 text-indigo-800 border-indigo-300",
    Shipped: "bg-blue-100 text-blue-800 border-blue-300",
    Delivered: "bg-green-100 text-green-800 border-green-300",
    Cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <PageContainer>
      <div className=" p-8">
        {/* Page Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <FaClipboardList className="text-green-600" /> 
          Order Management
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm
                         shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-5 py-2 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm
                         shadow-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-t-4 border-green-500 
                           p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                {/* Order Content */}
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">
                      Order #{order._id.slice(-6)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-lg">
                    <FaUser className="text-green-600" />
                    <div>
                      <p className="font-semibold">{order?.address?.fullName}</p>
                      <p className="text-sm text-gray-600">{order?.address?.email}</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="bg-gray-50/80 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTruck className="text-blue-600" />
                      <span className="font-semibold">Products</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order?.products?.map((p) => (
                        <div key={p.product?._id} className="mb-1">
                          {p.product?.name} (x{p.qty})
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-lg font-bold text-green-600">₹{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Summary */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total Orders: {filteredOrders.length}</span>
            <span className="text-gray-700 font-medium">
              Pending / Cancelled: {
                filteredOrders.filter(o => ['Pending', 'Cancelled'].includes(o.status)).length
              }
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Orders;
