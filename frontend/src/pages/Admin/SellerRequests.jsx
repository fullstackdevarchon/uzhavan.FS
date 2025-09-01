import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaBox,
  FaAppleAlt,
  FaPepperHot,
  FaLeaf,
} from "react-icons/fa";

const SellerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // 🔧 Replace with API later
    const mockRequests = [
      {
        id: 1,
        seller: "Rahul Sharma",
        product: "Catch Red Chilli Powder",
        category: "spices",
        price: 120, // per packet
        weight: "500g",
        quantity: 50, // stock
        status: "Pending",
      },
      {
        id: 2,
        seller: "Priya Singh",
        product: "Fresh Apples",
        category: "fruits",
        price: 180, // per kg
        weight: "1kg",
        quantity: 100,
        status: "Pending",
      },
      {
        id: 3,
        seller: "Amit Verma",
        product: "Fresh Mangoes",
        category: "fruits",
        price: 150,
        weight: "1kg",
        quantity: 75,
        status: "Pending",
      },
      {
        id: 4,
        seller: "Neha Gupta",
        product: "Fresh Tomatoes",
        category: "vegetables",
        price: 60,
        weight: "1kg",
        quantity: 200,
        status: "Pending",
      },
    ];
    setRequests(mockRequests);
  }, []);

  const updateStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((req) => req.category === filter);

  // Category icon helper
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "spices":
        return <FaPepperHot className="text-red-500" />;
      case "fruits":
        return <FaAppleAlt className="text-green-500" />;
      case "vegetables":
        return <FaLeaf className="text-emerald-600" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 tracking-wide drop-shadow-sm">
          📦 Seller Product Requests
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500 focus:ring focus:ring-blue-300 transition"
        >
          <option value="All">All Categories</option>
          <option value="spices">Spices</option>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 text-sm font-semibold uppercase tracking-wide">
              <th className="p-4 border">ID</th>
              <th className="p-4 border">Seller</th>
              <th className="p-4 border">Product</th>
              <th className="p-4 border">Category</th>
              <th className="p-4 border">Price</th>
              <th className="p-4 border">Weight</th>
              <th className="p-4 border">Quantity</th>
              <th className="p-4 border">Status</th>
              <th className="p-4 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-blue-50 transition text-sm md:text-base font-medium"
              >
                <td className="p-4 border text-center">{req.id}</td>
                <td className="p-4 border">{req.seller}</td>
                <td className="p-4 border">{req.product}</td>
                <td className="p-4 border capitalize flex items-center gap-2">
                  {getCategoryIcon(req.category)}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      req.category === "spices"
                        ? "bg-yellow-100 text-yellow-800"
                        : req.category === "fruits"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {req.category}
                  </span>
                </td>
                <td className="p-4 border text-center font-semibold text-gray-700">
                  ₹{req.price}
                </td>
                <td className="p-4 border text-center">{req.weight}</td>
                <td className="p-4 border text-center">{req.quantity}</td>
                <td className="p-4 border">
                  {req.status === "Pending" ? (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      Pending
                    </span>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  )}
                </td>
                <td className="p-4 border text-center">
                  {req.status === "Pending" && (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => updateStatus(req.id, "Approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, "Rejected")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md transition"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                #{req.id} — {req.seller}
              </span>
              {getCategoryIcon(req.category)}
            </div>
            <p className="text-gray-800 font-medium">{req.product}</p>
            <p className="text-gray-600 text-sm">💰 Price: ₹{req.price}</p>
            <p className="text-gray-600 text-sm">⚖️ Weight: {req.weight}</p>
            <p className="text-gray-600 text-sm">📦 Quantity: {req.quantity}</p>
            <div className="flex justify-between items-center mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                  req.status === "Pending"
                    ? "bg-gray-100 text-gray-700"
                    : req.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {req.status}
              </span>
              {req.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(req.id, "Approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full shadow-md transition"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, "Rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full shadow-md transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Data */}
      {filteredRequests.length === 0 && (
        <p className="text-center text-gray-500 mt-6 text-lg">
          No requests found.
        </p>
      )}
    </div>
  );
};

export default SellerRequests;
