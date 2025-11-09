import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaSearch,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";
import Cookies from "js-cookie";
import PageContainer from "../../components/PageContainer";

const API_URL = "http://localhost:5000/api/v1/orders";

const STATUS_META = {
  Delivered: {
    color: "text-green-700 bg-green-100 border-green-300",
    icon: <FaCheckCircle className="mr-2" />,
    step: 4,
  },
  Shipped: {
    color: "text-indigo-700 bg-indigo-100 border-indigo-300",
    icon: <FaTruck className="mr-2" />,
    step: 3,
  },
  Confirmed: {
    color: "text-blue-700 bg-blue-100 border-blue-300",
    icon: <FaTruck className="mr-2" />,
    step: 2,
  },
  "Order Placed": {
    color: "text-gray-700 bg-gray-100 border-gray-300",
    icon: <FaTruck className="mr-2" />,
    step: 1,
  },
  Cancelled: {
    color: "text-red-700 bg-red-100 border-red-300",
    icon: <FaTimesCircle className="mr-2" />,
    step: -1,
  },
};

const STEPS = ["Placed", "Confirmed", "Shipped", "Delivered"];

const Stepper = ({ currentStep, cancelled }) => (
  <div className="relative w-full flex justify-between items-center">
    {STEPS.map((step, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber <= currentStep && !cancelled;

      return (
        <div key={step} className="flex flex-col items-center flex-1 relative">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold z-10 shadow ${
              cancelled
                ? "bg-red-500 text-white"
                : isActive
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {cancelled ? "✕" : stepNumber}
          </div>

          {index < STEPS.length - 1 && (
            <div
              className={`absolute top-4 left-1/2 w-full h-1 ${
                cancelled
                  ? "bg-red-300"
                  : stepNumber < currentStep
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          )}

          <span className="mt-2 text-xs text-gray-700 font-medium">
            {step}
          </span>
        </div>
      );
    })}
  </div>
);

const formatAddress = (address) => {
  if (!address || typeof address !== "object") return "Default address";
  const { fullName, phone, street, city, state, country, zip } = address;
  return [fullName, phone, street, city, state, zip, country]
    .filter(Boolean)
    .join(", ");
};

const OrderCard = ({ order, onCancel, isExpanded, toggleExpand }) => {
  const cancelled = order.status === "Cancelled";
  const meta = STATUS_META[order.status] || STATUS_META["Order Placed"];
  const currentStep = cancelled ? 0 : meta.step;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
      <div className="p-5 grid gap-5 md:grid-cols-[1fr_auto_auto] items-center">
        {/* Left */}
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-gray-900">
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            Ordered on{" "}
            <span className="font-medium text-gray-800">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-gray-500" />
            <span className="truncate">
              Deliver to: {formatAddress(order.address)}
            </span>
          </div>
          <div className="mt-2 text-lg font-bold text-indigo-700">
            ₹ {Number(order.total).toFixed(2)}
          </div>
          <div className="mt-3 text-sm text-gray-800">
            <span className="font-medium">Products: </span>
            {order.products?.map((p, i) => (
              <span key={i}>
                {p.product?.name}
                {i < order.products.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${meta.color}`}
          >
            {meta.icon}
            {order.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
          <button
            onClick={toggleExpand}
            className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
          >
            Track Order
            <FaChevronDown
              className={`ml-2 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {!cancelled && order.status !== "Delivered" && (
            <button
              onClick={() => onCancel(order._id)}
              className="px-3 py-2 text-sm border rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              Cancel My Order
            </button>
          )}
        </div>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="pt-4 border-t">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Track Order
            </h4>
            <Stepper currentStep={currentStep} cancelled={cancelled} />
          </div>
        </div>
      )}
    </div>
  );
};

const OrderList = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filters = [
    "All",
    "Delivered",
    "Order Placed",
    "Confirmed",
    "Shipped",
    "Cancelled",
  ];

  const filtered = useMemo(() => {
    const base =
      filter === "All" ? orders : orders.filter((o) => o.status === filter);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      (o) =>
        String(o._id).includes(q) ||
        o.products?.some((p) =>
          (p.product?.name || "").toLowerCase().includes(q)
        ) ||
        (o.status || "").toLowerCase().includes(q)
    );
  }, [orders, filter, query]);

  const handleCancel = async (id) => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_URL}/${id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Cancel failed");
      }

      // Update status in UI immediately
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "Cancelled" } : o))
      );
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.message || "Failed to cancel order. Please try again.");
    }
  };

  const toggleExpand = (id) =>
    setExpandedId((cur) => (cur === id ? null : id));

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          My Orders
        </h1>

        {/* Filters + Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full border text-sm transition ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div className="md:ml-auto w-full md:w-80">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product or order id"
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              No orders found
            </h3>
            <p className="text-gray-600 mt-1">
              Try clearing filters or searching with a different term.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((o) => (
              <OrderCard
                key={o._id}
                order={o}
                onCancel={handleCancel}
                isExpanded={expandedId === o._id}
                toggleExpand={() => toggleExpand(o._id)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default OrderList;
