// src/pages/Admin/Inventory.jsx
import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaBoxOpen,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // 🔧 Replace with API
    const mockData = [
      { id: 1, product: "Fresh Apples", stock: 5, status: "Low Stock" },
      { id: 2, product: "Tomatoes", stock: 0, status: "Out of Stock" },
      { id: 3, product: "Red Chilli Powder", stock: 200, status: "In Stock" },
      { id: 4, product: "Organic Rice", stock: 18, status: "Low Stock" },
      { id: 5, product: "Green Tea Bags", stock: 0, status: "Out of Stock" },
    ];
    setInventory(mockData);
  }, []);

  // 🔍 Filtered data
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.product
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "All" ? true : item.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    if (status === "Low Stock")
      return (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs md:text-sm font-semibold inline-flex items-center gap-1 shadow-sm">
          <FaExclamationTriangle className="text-yellow-600 text-xs md:text-sm" />{" "}
          Low Stock
        </span>
      );
    if (status === "Out of Stock")
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs md:text-sm font-semibold inline-flex items-center gap-1 shadow-sm">
          <FaExclamationTriangle className="text-red-600 text-xs md:text-sm" />{" "}
          Out of Stock
        </span>
      );
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-sm">
        In Stock
      </span>
    );
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
        <FaBoxOpen className="text-blue-600 text-lg md:text-2xl" /> Inventory & Stock Alerts
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 md:py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm md:text-base"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaFilter className="text-gray-500 text-sm md:text-base" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm md:text-base"
          >
            <option value="All">All</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-full">
                  <FaBoxOpen className="text-blue-500 text-xl md:text-2xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-semibold text-base md:text-lg">
                    {item.product}
                  </span>
                  <span className="text-gray-600 text-sm md:text-base">
                    ID: {item.id}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-center gap-2 md:gap-0 md:flex-row md:gap-6">
                <span className="text-gray-700 font-medium">
                  Stock: {item.stock}
                </span>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 italic text-sm md:text-base">
            No products found
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="p-4 bg-gray-100 text-gray-700 text-sm md:text-base flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 mt-6 rounded-xl">
        <span>Total Products: {filteredInventory.length}</span>
        <span className="font-semibold">
          Low / Out of Stock:{" "}
          {filteredInventory.filter(
            (i) => i.status === "Low Stock" || i.status === "Out of Stock"
          ).length}
        </span>
      </div>
    </div>
  );
};

export default Inventory;
