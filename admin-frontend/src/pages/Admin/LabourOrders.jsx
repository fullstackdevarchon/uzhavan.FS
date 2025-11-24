import React, { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUser,
  FaClipboardList,
  FaBoxOpen,
  FaShippingFast,
  FaHourglassHalf,
} from "react-icons/fa";
import toast from "react-hot-toast";
import PageContainer from "../../components/PageContainer";
import Preloader from "../../components/Preloader"; // ✅ Import added here

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LabourOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [labourMap, setLabourMap] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/v1/orders/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || data || []);
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || "Failed to load labour orders");
        }
      } catch (e) {
        console.error("Admin LabourOrders fetch error", e);
        toast.error("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    const fetchLabours = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/labours`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const list = data.labours || [];
          const map = {};
          list.forEach((l) => {
            if (l && (l._id || l.id))
              map[String(l._id || l.id)] = l.fullName || l.name || "Labour";
          });
          setLabourMap(map);
        }
      } catch (e) {
        console.warn("Fetch labours failed (non-blocking)", e);
      }
    };

    fetchOrders();
    fetchLabours();
  }, []);

  // Helper functions
  const getEffectiveAssigneeId = (o) => {
    const direct = o.assignedTo && (o.assignedTo._id || o.assignedTo.id || o.assignedTo);
    if (direct) return String(direct);
    const hist = Array.isArray(o.statusHistory) ? o.statusHistory : [];
    for (let i = hist.length - 1; i >= 0; i--) {
      const cb = hist[i]?.changedBy;
      if (cb) return String(cb);
    }
    return null;
  };

  const getEffectiveAssigneeName = (o) => {
    const id = getEffectiveAssigneeId(o);
    if (!id) return "Unassigned";
    return labourMap[id] || `ID:${id.slice(-6)}`;
  };

  const normStatus = (s = "") => s.toLowerCase();
  const isPending = (s) => {
    const v = normStatus(s);
    return v !== "delivered" && v !== "cancelled";
  };

  // Filtering logic
  const filtered = useMemo(() => {
    return (orders || [])
      .filter((o) => {
        if (status === "all") return true;
        if (status === "pending") return isPending(o.status);
        if (status === "unassigned") return !getEffectiveAssigneeId(o);
        if (status === "assigned") return !!getEffectiveAssigneeId(o);
        return normStatus(o.status) === status;
      })
      .filter((o) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        const id = String(o._id || "").toLowerCase();
        const labourName = String(getEffectiveAssigneeName(o)).toLowerCase();
        return id.includes(q) || labourName.includes(q);
      });
  }, [orders, status, search, labourMap]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => normStatus(o.status) === "delivered").length;
    const pending = orders.filter((o) => isPending(o.status)).length;
    const unassigned = orders.filter((o) => !getEffectiveAssigneeId(o)).length;
    return { total, delivered, pending, unassigned };
  }, [orders, labourMap]);

  // Group by labour for performance
  const labourPerformance = useMemo(() => {
    const map = new Map();
    for (const o of filtered) {
      const effId = getEffectiveAssigneeId(o) || "unassigned";
      const labourName =
        effId === "unassigned"
          ? "Unassigned"
          : labourMap[effId] || `ID:${String(effId).slice(-6)}`;
      if (!map.has(effId)) {
        map.set(effId, {
          id: effId,
          name: labourName,
          finished: 0,
          pending: 0,
          activeOrder: null,
        });
      }
      const entry = map.get(effId);
      const v = normStatus(o.status);
      if (v === "delivered") entry.finished += 1;
      else if (v !== "cancelled") entry.pending += 1;

      const isActive = v !== "delivered" && v !== "cancelled";
      if (isActive) {
        const current = entry.activeOrder;
        if (!current) entry.activeOrder = o;
        else {
          const curT = new Date(current.createdAt || 0).getTime();
          const newT = new Date(o.createdAt || 0).getTime();
          if (newT > curT) entry.activeOrder = o;
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      const aUn = a.id === "unassigned";
      const bUn = b.id === "unassigned";
      if (aUn !== bUn) return aUn ? 1 : -1;
      return b.finished - a.finished;
    });
  }, [filtered, labourMap]);

  const getStatusBadge = (s) => {
    const v = normStatus(s);
    switch (v) {
      case "order placed":
      case "confirmed":
        return { cls: "bg-blue-100 text-blue-800", icon: <FaClipboardList /> };
      case "shipped":
        return { cls: "bg-purple-100 text-purple-800", icon: <FaShippingFast /> };
      case "delivered":
        return { cls: "bg-green-100 text-green-800", icon: <FaCheckCircle /> };
      case "cancelled":
        return { cls: "bg-red-100 text-red-800", icon: <FaTimesCircle /> };
      default:
        return { cls: "bg-gray-100 text-gray-800", icon: <FaHourglassHalf /> };
    }
  };

  // ✅ Show Preloader while data is loading
  // if (loading) {
  //   return <Preloader />;
  // }

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 flex items-center gap-2">
            <FaTruck className="text-indigo-300" /> Labour Orders
          </h1>
          <p className="text-white">
            Monitor labour delivery workflow and performance
          </p>
        </div>

        {/* Filters & Stats */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Labour name or Order ID"
                className="pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 w-72 max-w-full"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-2 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="bg-white rounded-lg shadow p-3 text-center">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 text-center">
              <div className="text-sm text-gray-500">Delivered</div>
              <div className="text-xl font-bold text-green-600">
                {stats.delivered}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 text-center">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-xl font-bold text-amber-600">
                {stats.pending}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 text-center">
              <div className="text-sm text-gray-500">Unassigned</div>
              <div className="text-xl font-bold text-indigo-600">
                {stats.unassigned}
              </div>
            </div>
          </div>
        </div>

        {/* Labour Performance */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            Labour Performance
          </h2>

          {labourPerformance.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {labourPerformance.map((l) => (
                <div
                  key={l.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <FaUser className="text-indigo-600" /> {l.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {l.id === "unassigned"
                        ? "Unassigned bucket"
                        : `ID: ${String(l.id).slice(-6)}`}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700">
                      <FaCheckCircle /> Finished: {l.finished}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-700">
                      <FaTruck /> Pending: {l.pending}
                    </span>
                  </div>

                  {l.activeOrder && (
                    <div className="mt-3 text-sm text-gray-700">
                      <div className="font-medium flex items-center gap-2">
                        <FaClipboardList className="text-indigo-600" /> Active
                        Order #{String(l.activeOrder._id || "").slice(-6)}
                      </div>
                      <div className="mt-1 text-gray-600">
                        Buyer: {l.activeOrder.buyer?.fullName || "-"} · Status:{" "}
                        {l.activeOrder.status || "-"}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-sm">
              No labour data for current filters.
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Labour
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((o) => {
                    const badge = getStatusBadge(o.status);
                    return (
                      <tr key={o._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-mono">
                          #{String(o._id || "").slice(-6)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="inline-flex items-center gap-2">
                            <FaUser className="text-indigo-600" />
                            {(() => {
                              const name = getEffectiveAssigneeName(o);
                              return name === "Unassigned" ? (
                                <span className="text-gray-500">Unassigned</span>
                              ) : (
                                name
                              );
                            })()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.cls}`}
                          >
                            {badge.icon} {o.status || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {o.buyer?.fullName || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-600">
              <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-2" />
              No orders match your filters.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default LabourOrders;
