// src/pages/Admin/SellerRequests.jsx
import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaBox,
  FaAppleAlt,
  FaPepperHot,
  FaLeaf,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const SellerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all seller product requests from backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/products/all", {
        withCredentials: true, // send cookies (auth)
      });

      if (data.success) {
        setRequests(data.products);
      } else {
        toast.error("Failed to fetch requests");
      }
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
      toast.error(error.response?.data?.message || "Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Update product status (approve/reject)
  const updateStatus = async (id, newStatus) => {
    try {
      const { data } = await axios.patch(
        `/api/v1/products/${id}/status`,
        { status: newStatus.toLowerCase() }, // backend expects lowercase
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(`Product ${newStatus}`);
        // Update state instantly
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, status: newStatus.toLowerCase() } : req
          )
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  // ✅ Filtered requests
  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter(
          (req) => req.category?.name?.toLowerCase() === filter.toLowerCase()
        );

  // ✅ Category icon helper
  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
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

      {loading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : (
        <>
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
                    key={req._id}
                    className="hover:bg-blue-50 transition text-sm md:text-base font-medium"
                  >
                    <td className="p-4 border text-center">{req._id}</td>
                    <td className="p-4 border">{req.seller?.fullName}</td>
                    <td className="p-4 border">{req.name}</td>
                    <td className="p-4 border capitalize flex items-center gap-2">
                      {getCategoryIcon(req.category?.name)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          req.category?.name?.toLowerCase() === "spices"
                            ? "bg-yellow-100 text-yellow-800"
                            : req.category?.name?.toLowerCase() === "fruits"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {req.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 border text-center font-semibold text-gray-700">
                      ₹{req.price}
                    </td>
                    <td className="p-4 border text-center">{req.weight}</td>
                    <td className="p-4 border text-center">{req.quantity}</td>
                    <td className="p-4 border">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          req.status === "pending"
                            ? "bg-gray-100 text-gray-700"
                            : req.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 border text-center">
                      {req.status === "pending" && (
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => updateStatus(req._id, "Approved")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => updateStatus(req._id, "Rejected")}
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
                key={req._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    #{req._id.slice(-5)} — {req.seller?.fullName}
                  </span>
                  {getCategoryIcon(req.category?.name)}
                </div>
                <p className="text-gray-800 font-medium">{req.name}</p>
                <p className="text-gray-600 text-sm">💰 Price: ₹{req.price}</p>
                <p className="text-gray-600 text-sm">⚖️ Weight: {req.weight}</p>
                <p className="text-gray-600 text-sm">📦 Quantity: {req.quantity}</p>
                <div className="flex justify-between items-center mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      req.status === "pending"
                        ? "bg-gray-100 text-gray-700"
                        : req.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(req._id, "Approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full shadow-md transition"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => updateStatus(req._id, "Rejected")}
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
        </>
      )}
    </div>
  );
};

export default SellerRequests;
