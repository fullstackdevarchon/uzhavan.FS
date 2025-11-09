// src/pages/Admin/SellerRequests.jsx
import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaPepperHot,
  FaAppleAlt,
  FaLeaf,
  FaBox,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { sendNotification } from "../../socket"; // ✅ Import socket helper
import PageContainer from "../../components/PageContainer";

const SellerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("pending"); // default
  const [loading, setLoading] = useState(false);
  const [rejectOptions, setRejectOptions] = useState({});

  // Fetch product requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/products/all",
        { withCredentials: true }
      );
      if (data.success) {
        setRequests(data.products);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories (only enabled)
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/categories/all",
        { withCredentials: true }
      );
      if (data.success) {
        const enabled = data.categories.filter((cat) => cat.enabled);
        setCategories(enabled);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching categories");
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, []);

  // Count approved per category
  const getApprovedCount = (catName) => {
    return requests.filter(
      (req) =>
        req.status === "approved" &&
        req.category?.name?.toLowerCase() === catName?.toLowerCase()
    ).length;
  };

  // Update product status with limit check and send notification
  const updateStatus = async (id, newStatus, rejectionReason = "") => {
    const product = requests.find((r) => r._id === id);
    const category = categories.find(
      (c) => c.name.toLowerCase() === product?.category?.name?.toLowerCase()
    );

    if (newStatus.toLowerCase() === "approved" && category) {
      const approvedCount = getApprovedCount(category.name);
      if (approvedCount >= category.limit) {
        toast.error(
          `Limit reached for ${category.name} (Limit: ${category.limit})`
        );
        return;
      }
    }

    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/v1/products/${id}/status`,
        { status: newStatus.toLowerCase(), rejectionReason },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(`Product ${newStatus}`);
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id
              ? { ...req, status: newStatus.toLowerCase(), rejectionReason }
              : req
          )
        );
        setRejectOptions((prev) => ({ ...prev, [id]: false }));

        // ✅ Send notification to the seller
        if (product.seller?._id) {
          sendNotification({
            role: product.seller._id, // sending notification to this seller ID
            title: `Product ${newStatus}`,
            message: `Your product "${product.name}" has been ${newStatus}${
              rejectionReason ? `: ${rejectionReason}` : ""
            }.`,
          });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  // Apply filters
  const filteredRequests = requests.filter((req) => {
    const categoryMatch =
      categoryFilter === "All" ||
      req.category?.name?.toLowerCase() === categoryFilter.toLowerCase();

    const statusMatch = req.status === statusFilter.toLowerCase();

    return categoryMatch && statusMatch;
  });

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

  const rejectionReasons = [
    "Picture not quality",
    "Price is too high",
    "Invalid product details",
    "Duplicate listing",
    "Other issues",
  ];

  return (
    <PageContainer>
      <div className="p-6 max-w-9x3 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          📦 Seller Product Requests
        </h2>

        <div className="flex gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-4 py-2 text-sm shadow-sm"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-4 py-2 text-sm shadow-sm"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Category Limit Overview */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const approvedCount = getApprovedCount(cat.name);
          return (
            <div
              key={cat._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col items-center text-center"
            >
              <div className="text-2xl mb-2">{getCategoryIcon(cat.name)}</div>
              <h3 className="font-semibold text-gray-800">{cat.name}</h3>
              <p className="text-sm text-gray-600">
                Limit: <span className="font-bold">{cat.limit}</span>
              </p>
              <p className="text-sm text-gray-600">
                Approved:{" "}
                <span
                  className={`font-bold ${
                    approvedCount >= cat.limit
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {approvedCount}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Grid view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((req) => {
              const category = categories.find(
                (c) =>
                  c.name.toLowerCase() === req.category?.name?.toLowerCase()
              );
              const approvedCount = category
                ? getApprovedCount(category.name)
                : 0;

              return (
                <div
                  key={req._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 p-4 flex flex-col"
                >
                  <img
                    src={req.image?.url || "/placeholder.png"}
                    alt={req.name}
                    className="h-40 w-full object-cover rounded-lg mb-3"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {req.name}
                    </h3>
                    {getCategoryIcon(req.category?.name)}
                  </div>

                  <p className="text-sm text-gray-600">
                    Seller: {req.seller?.fullName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">💰 ₹{req.price}</p>
                  <p className="text-sm text-gray-600">⚖️ {req.weight}</p>
                  <p className="text-sm text-gray-600">📦 {req.quantity}</p>

                  {/* Category Limit Info */}
                  {category && (
                    <p className="text-xs mt-2 text-gray-500">
                      Limit:{" "}
                      <span className="font-semibold">{category.limit}</span> |{" "}
                      Approved:{" "}
                      <span className="font-semibold">{approvedCount}</span>
                    </p>
                  )}

                  <p
                    className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                      req.status === "pending"
                        ? "bg-gray-100 text-gray-700"
                        : req.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </p>

                  {/* Actions */}
                  {req.status === "pending" && (
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => updateStatus(req._id, "Approved")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          category &&
                          getApprovedCount(category.name) >= category.limit
                        }
                      >
                        <FaCheck /> Approve
                      </button>

                      {/* Reject with reason */}
                      {!rejectOptions[req._id] ? (
                        <button
                          onClick={() =>
                            setRejectOptions((prev) => ({
                              ...prev,
                              [req._id]: true,
                            }))
                          }
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex justify-center items-center gap-2"
                        >
                          <FaTimes /> Reject
                        </button>
                      ) : (
                        <div className="space-y-2">
                          {rejectionReasons.map((reason) => (
                            <button
                              key={reason}
                              onClick={() =>
                                updateStatus(req._id, "Rejected", reason)
                              }
                              className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded text-sm"
                            >
                              {reason}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show rejection reason if rejected */}
                  {req.status === "rejected" && req.rejectionReason && (
                    <p className="mt-2 text-xs text-red-600">
                      ❌ Reason: {req.rejectionReason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {filteredRequests.length === 0 && (
            <p className="text-center text-gray-900 mt-6 text-lg">
              No requests found.
            </p>
          )}
        </>
      )}
      </div>
    </PageContainer>
  );
};

export default SellerRequests;
