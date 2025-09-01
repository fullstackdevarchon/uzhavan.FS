// src/pages/Admin/Orders.jsx
import React, { useState, useEffect } from "react";
import {
  FaTruck,
  FaClipboardList,
  FaUser,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // 🔧 Replace with API
    const mockOrders = [
      { id: 101, customer: "Rahul Sharma", product: "Apples", status: "Pending" },
      { id: 102, customer: "Priya Singh", product: "Mangoes", status: "Shipped" },
      { id: 103, customer: "Neha Gupta", product: "Chilli Powder", status: "Delivered" },
      { id: 104, customer: "Amit Verma", product: "Tomatoes", status: "Cancelled" },
    ];
    setOrders(mockOrders);
  }, []);

  // 🔍 Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" ? true : order.status === filter;
    return matchesSearch && matchesFilter;
  });

  // 🎨 Status Color Mapping
  const statusClasses = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Shipped: "bg-blue-100 text-blue-800 border-blue-300",
    Delivered: "bg-green-100 text-green-800 border-green-300",
    Cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      {/* Page Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 tracking-wide">
        <FaClipboardList className="text-green-600" /> Order Management
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
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-sm md:text-base"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-5 py-2 rounded-xl border border-gray-300 bg-white shadow-md 
                       focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none 
                       text-sm md:text-base font-medium cursor-pointer transition-all duration-200
                       hover:shadow-lg hover:border-green-400"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-2xl shadow-md border p-6 flex flex-col gap-4 hover:shadow-2xl transition transform hover:-translate-y-1 ${statusClasses[order.status]}`}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Order #{order.id}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusClasses[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Customer */}
              <div className="flex items-center gap-3">
                <FaUser className="text-green-700 text-lg" />
                <span className="font-semibold text-base">{order.customer}</span>
              </div>

              {/* Product */}
              <div className="flex items-center gap-3">
                <FaTruck className="text-blue-700 text-lg" />
                <span className="text-sm md:text-base">{order.product}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 italic py-10 text-lg">
            No orders found
          </p>
        )}
      </div>

      {/* Footer Summary */}
      <div className="mt-8 p-4 bg-white rounded-xl shadow flex justify-between items-center text-sm md:text-base text-gray-700 font-medium">
        <span>Total Orders: {filteredOrders.length}</span>
        <span className="font-semibold">
          Pending / Cancelled:{" "}
          {
            filteredOrders.filter(
              (o) => o.status === "Pending" || o.status === "Cancelled"
            ).length
          }
        </span>
      </div>
    </div>
  );
};

export default Orders;
