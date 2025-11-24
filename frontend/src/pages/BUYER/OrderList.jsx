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
    color: "text-green-700 bg-green-200/30 border-green-400",
    icon: <FaCheckCircle className="mr-2" />,
    step: 4,
  },
  Shipped: {
    color: "text-indigo-700 bg-indigo-200/30 border-indigo-400",
    icon: <FaTruck className="mr-2" />,
    step: 3,
  },
  Confirmed: {
    color: "text-blue-700 bg-blue-200/30 border-blue-400",
    icon: <FaTruck className="mr-2" />,
    step: 2,
  },
  "Order Placed": {
    color: "text-gray-700 bg-gray-200/30 border-gray-400",
    icon: <FaTruck className="mr-2" />,
    step: 1,
  },
  Cancelled: {
    color: "text-red-700 bg-red-200/30 border-red-400",
    icon: <FaTimesCircle className="mr-2" />,
    step: -1,
  },
};

const STEPS = ["Placed", "Confirmed", "Shipped", "Delivered"];

const Stepper = ({ currentStep, cancelled }) => (
  <div className="w-full flex justify-between items-center relative">

    {STEPS.map((step, index) => {
      const stepNumber = index + 1;
      const isCompleted = stepNumber < currentStep && !cancelled;
      const isActive = stepNumber === currentStep && !cancelled;

      return (
        <div key={step} className="flex flex-col items-center flex-1 relative">

          {/* CONNECTOR LINE (BETWEEN CIRCLES) */}
          {index < STEPS.length - 1 && (
            <div className="absolute top-5 left-1/2 w-full">
              <div
                className={`
                  h-1 
                  ${cancelled
                    ? "bg-red-300"
                    : isCompleted
                    ? "bg-green-500"
                    : "bg-gray-300"}
                `}
              ></div>
            </div>
          )}

          {/* STEP CIRCLE */}
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center 
              text-sm font-bold shadow-md z-10
              ${
                cancelled
                  ? "bg-red-500 text-white"
                  : isCompleted || isActive
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }
            `}
          >
            {cancelled ? "✕" : stepNumber}
          </div>

          {/* STEP LABEL */}
          <span className="mt-2 text-xs text-gray-200">{step}</span>
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
    <div className="
      bg-white/10 backdrop-blur-xl border border-white/20 
      rounded-2xl p-6 shadow-2xl transition-all duration-300
      hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]
    ">
      <div className="grid gap-5 md:grid-cols-[1fr_auto_auto] items-center">

        {/* LEFT SECTION */}
        <div className="min-w-0 text-white">
          <h3 className="text-xl font-bold tracking-wide">
            ORDER #{order._id.slice(-6).toUpperCase()}
          </h3>

          <div className="mt-1 text-sm text-gray-200">
            Ordered on{" "}
            <span className="font-semibold text-white">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-gray-100">
            <FaMapMarkerAlt className="text-gray-300" />
            <span className="truncate">
              Deliver to: {formatAddress(order.address)}
            </span>
          </div>

          <div className="mt-2 text-lg font-bold text-yellow-300">
            ₹ {Number(order.total).toFixed(2)}
          </div>

          <div className="mt-3 text-sm text-gray-100">
            <span className="font-semibold text-white">Products: </span>
            {order.products?.map((p, i) => (
              <span key={i}>
                {p.product?.name}
                {i < order.products.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center justify-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-semibold ${meta.color}`}
          >
            {meta.icon}
            {order.status}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
          <button
            onClick={toggleExpand}
            className="
              px-3 py-2 text-sm border rounded-lg 
              bg-white/20 text-white border-white/30 
              hover:bg-white/30 transition flex items-center shadow-sm
            "
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
              className="
                px-3 py-2 text-sm border rounded-lg 
                text-red-300 bg-red-500/20 border-red-400/40
                hover:bg-red-500/30 transition shadow-sm
              "
            >
              Cancel My Order
            </button>
          )}
        </div>
      </div>

      {/* EXPANDED PANEL */}
      {isExpanded && (
        <div className="pt-4 mt-4 border-t border-white/20 text-white">
          <h4 className="text-lg font-semibold mb-4">Track Order Status</h4>
          <Stepper currentStep={currentStep} cancelled={cancelled} />
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
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
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
      if (!res.ok) throw new Error(data.message);

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "Cancelled" } : o))
      );

      alert("Order cancelled successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleExpand = (id) =>
    setExpandedId((cur) => (cur === id ? null : id));

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg font-medium">
        Loading your orders...
      </div>
    );

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center tracking-wide">
          MY ORDERS
        </h1>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm shadow 
                    ${
                      active
                        ? "bg-indigo-600 text-white shadow-indigo-300"
                        : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                    }`}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* SEARCH BAR */}
          <div className="md:ml-auto w-full md:w-80">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders..."
                className="
                  w-full pl-10 pr-3 py-2 rounded-xl 
                  border border-white/20 bg-white/10 text-white 
                  placeholder-gray-300 shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
              />
            </div>
          </div>
        </div>

        {/* ORDER CARDS */}
        {filtered.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center shadow-2xl text-white">
            <h3 className="text-xl font-semibold">No orders found</h3>
            <p className="text-gray-200 mt-1">
              Try another filter or search keyword.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
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
