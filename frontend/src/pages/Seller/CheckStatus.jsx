// src/pages/Seller/CheckStatus.jsx
import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBalanceScale,
  FaBoxes,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import PageContainer from "../../components/PageContainer";

function CheckStatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seller products from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/products/seller",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setOrders(data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      toast.error("Failed to fetch order status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Delete pending product
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("❌ Product delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
      case "Pending":
        return (
          <span className="flex items-center gap-2 text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm font-semibold">
            <FaClock /> Pending
          </span>
        );
      case "approved":
      case "Accepted":
        return (
          <span className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
            <FaCheckCircle /> Accepted
          </span>
        );
      case "rejected":
      case "Rejected":
        return (
          <span className="flex items-center gap-2 text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-semibold">
            <FaTimesCircle /> Rejected
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <PageContainer>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800 text-center">
        📊 Product Approval Status
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition relative"
            >
              {/* Product Image */}
              <img
                src={product.image?.url || product.image}
                alt={product.name}
                className="w-full h-40 object-contain bg-gray-50"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300x200?text=No+Image")
                }
              />

              {/* Product Info */}
              <div className="p-4 flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize mb-2">
                  {product.category?.name || "Uncategorized"}
                </p>
                <p className="text-gray-900 font-bold mb-3">₹{product.price}</p>

                {/* Weight & Quantity */}
                <div className="flex items-center justify-between mb-3 text-sm text-gray-700">
                  <span className="flex items-center gap-2">
                    <FaBalanceScale className="text-gray-500" />
                    <span className="font-medium">Weight:</span>{" "}
                    {product.weight}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaBoxes className="text-gray-500" />
                    <span className="font-medium">Qty:</span>{" "}
                    {product.quantity}
                  </span>
                </div>

                {/* Status */}
                <div className="mb-3">{getStatusBadge(product.status)}</div>

                {/* Admin Response */}
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-gray-700">Admin:</span>{" "}
                  {product.rejectionReason
                    ? product.rejectionReason
                    : product.status === "approved"
                    ? "Product verified successfully"
                    : "Awaiting admin review"}
                </p>

                {/* Delete Button for Pending Only */}
                {(product.status === "pending" ||
                  product.status === "Pending") && (
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition text-sm"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </PageContainer>
  );
}

export default CheckStatus;
