import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaSearch,
  FaUndo,
  FaRedo,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";

// ✅ Import products.json
import productsData from "../../data/products.json";

const STATUS_META = {
  Delivered: {
    color: "text-green-700 bg-green-100 border-green-300",
    icon: <FaCheckCircle className="mr-2" />,
    step: 4,
  },
  Processing: {
    color: "text-yellow-700 bg-yellow-100 border-yellow-300",
    icon: <FaTruck className="mr-2" />,
    step: 2,
  },
  Cancelled: {
    color: "text-red-700 bg-red-100 border-red-300",
    icon: <FaTimesCircle className="mr-2" />,
    step: -1,
  },
};

const FALLBACK_IMG = "https://via.placeholder.com/80.png?text=Img";
const STEPS = ["Placed", "Shipped", "Out for delivery", "Delivered"];

const Stepper = ({ currentStep, cancelled }) => {
  if (cancelled) {
    return (
      <div className="px-4 py-3 border rounded-xl bg-red-50 border-red-200 text-red-700 text-sm">
        Order was cancelled. If this is unexpected, contact support.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const active = stepNum <= currentStep;
          return (
            <div key={label} className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border 
                ${
                  active
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
                title={label}
              >
                {stepNum}
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded 
                  ${stepNum < currentStep ? "bg-indigo-600" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid grid-cols-4 text-xs text-gray-600">
        {STEPS.map((label) => (
          <div key={label} className="text-center">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderCard = ({
  order,
  onCancel,
  onReturn,
  onBuyAgain,
  isExpanded,
  toggleExpand,
}) => {
  const meta = STATUS_META[order.status] || STATUS_META.Processing;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="p-5 grid gap-5 md:grid-cols-[auto_1fr_auto_auto] items-center">
        {/* Thumbnail */}
        <div className="flex items-center justify-center md:justify-start">
          <img
            src={order.image}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
            alt={order.product}
            className="w-20 h-20 rounded-lg border object-contain bg-white"
          />
        </div>

        {/* Details */}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {order.product}
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            Ordered on{" "}
            <span className="font-medium text-gray-800">{order.date}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt />
            <span className="truncate">
              Deliver to: {order.address || "Default address"}
            </span>
          </div>
          <div className="mt-2 text-base font-bold text-gray-900">
            ₹ {Number(order.price).toFixed(2)}
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-start md:justify-center">
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

          {order.status === "Processing" && (
            <button
              onClick={() => onCancel(order.id)}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
            >
              Cancel Order
            </button>
          )}

          {order.status === "Delivered" && (
            <>
              <button
                onClick={() => onReturn(order.id)}
                className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
              >
                <FaUndo className="mr-2" />
                Return
              </button>
              <Link
                to={`/buyer-dashboard/product/${order.productId}`}
                onClick={() => onBuyAgain(order.id)}
                className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
              >
                <FaRedo className="mr-2" />
                Buy Again
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Expandable tracker */}
      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="pt-4 border-t">
            <Stepper
              currentStep={Math.max(1, meta.step)}
              cancelled={meta.step === -1}
            />
            <div className="mt-4 grid gap-2 text-sm text-gray-700">
              {order.status === "Delivered" && (
                <>
                  <div>• Order placed on {order.date}</div>
                  <div>
                    • Shipped via {order.courier || "BlueDart"} (AWB:{" "}
                    {order.awb || "—"})
                  </div>
                  <div>• Delivered on {order.deliveredOn || order.date}</div>
                </>
              )}
              {order.status === "Processing" && (
                <>
                  <div>• Order confirmed on {order.date}</div>
                  <div>• Preparing for shipment</div>
                </>
              )}
              {order.status === "Cancelled" && (
                <div>• {order.cancelReason || "Cancelled by user"}</div>
              )}
            </div>
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

  // ✅ Load demo orders from products.json
  useEffect(() => {
    const demoOrders = productsData.slice(0, 5).map((p, idx) => ({
      id: 1000 + idx,
      productId: p.id,
      product: p.title,
      image: p.image,
      date: "2025-08-26",
      price: p.price,
      status: idx === 0 ? "Delivered" : idx === 1 ? "Processing" : "Cancelled",
      deliveredOn: idx === 0 ? "2025-08-27" : undefined,
      courier: "Delhivery",
      awb: `DLV${1000 + idx}`,
      address: "123 Main Street, City",
      cancelReason: idx === 2 ? "Payment not captured" : undefined,
    }));
    setOrders(demoOrders);
  }, []);

  const filters = ["All", "Delivered", "Processing", "Cancelled"];

  const filtered = useMemo(() => {
    const base =
      filter === "All" ? orders : orders.filter((o) => o.status === filter);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      (o) =>
        String(o.id).includes(q) ||
        o.product.toLowerCase().includes(q) ||
        (o.status || "").toLowerCase().includes(q)
    );
  }, [orders, filter, query]);

  const handleCancel = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: "Cancelled", cancelReason: "Cancelled by user" }
          : o
      )
    );
  };

  const handleReturn = (id) => {
    alert(`Return initiated for order #${id}`);
  };

  const handleBuyAgain = (id) => {
    // Placeholder for integration
  };

  const toggleExpand = (id) =>
    setExpandedId((cur) => (cur === id ? null : id));

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-6 px-4 md:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            My Orders
          </h1>
        </div>

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

        {/* Orders list */}
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
                key={o.id}
                order={o}
                onCancel={handleCancel}
                onReturn={handleReturn}
                onBuyAgain={handleBuyAgain}
                isExpanded={expandedId === o.id}
                toggleExpand={() => toggleExpand(o.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
