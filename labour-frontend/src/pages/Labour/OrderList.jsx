import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaClipboardList,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaBoxOpen,
  FaInfoCircle,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaRupeeSign,
  FaShippingFast,
  FaClock,
} from "react-icons/fa";
import PageContainer from "../../components/PageContainer";
import Preloader from "../../components/Preloader"; // Assuming Preloader is available and correct

const OrderList = ({ mode = "all", hideDeliveredDefault = false, showFinishedSummary = false }) => {
  const [orders, setOrders] = useState([]);
  const [hasActiveAssigned, setHasActiveAssigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState({});
  const [expanded, setExpanded] = useState(null); // row details
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const myUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // console.debug(" fetchOrders:start");
      const response = await fetch(`${API_BASE}/api/labours/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setHasActiveAssigned(!!data.hasActiveAssigned);
        // console.debug(" fetchOrders:success count=", (data.orders || []).length);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
      // console.debug(" fetchOrders:end");
    }
  };

  // Assign order to labour
  const handleAssignOrder = async (orderId) => {
    try {
      if (hasActiveOrder) {
        toast.error("You already have an active order. Complete it before taking another.");
        // console.warn(" assign:block due to active order. orderId=", orderId);
        return;
      }
      setUpdating({ [orderId]: { action: "assign" } });
      const token = localStorage.getItem("token");
      // console.debug(" assign:start orderId=", orderId);

      await axios.post(
        `${API_BASE}/api/labours/orders/${orderId}/assign`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order assigned successfully");
      // console.debug(" assign:success orderId=", orderId);
      // Optimistic update so UI reflects assignment immediately and disables further clicks
      setOrders((prev) => prev.map((o) => (
        o._id === orderId
          ? {
              ...o,
              isAssigned: true,
              assignedTo: myUserId,
              status: "Confirmed",
              currentStatus: { status: "Confirmed", updatedAt: new Date().toISOString() }
            }
          : o
      )));
      setHasActiveAssigned(true);
      fetchOrders(); // refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign order");
      console.error(" assign:error orderId=", orderId, error.response?.data || error.message);
    } finally {
      setUpdating({});
      // console.debug(" assign:end orderId=", orderId);
    }
  };


  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Mark this order as ${newStatus}?`)) return;

    try {
      setUpdating((prev) => ({ ...prev, [orderId]: { action: "status" } }));
      const token = localStorage.getItem("token");
      // console.debug(" status:start orderId=", orderId, "newStatus=", newStatus);
      const response = await fetch(
        `${API_BASE}/api/labours/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, ...updatedOrder.order } : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
        // Refresh list to recompute hasActiveAssigned and include any newly visible items
        fetchOrders();
        // Clear active flags
        setHasActiveAssigned(false);
        // console.debug("✅ status:success orderId=", orderId, "newStatus=", newStatus);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update order status");
        console.error(" status:error orderId=", orderId, errorData);
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: { action: null } }));
      // console.debug(" status:end orderId=", orderId);
    }
  };

  // Does the current labour already have an active order?
  const myActiveExists = useMemo(() => {
    if (!myUserId) return false;
    return orders.some((o) => {
      const assignedToId = typeof o.assignedTo === "string" ? o.assignedTo : (o.assignedTo?._id || o.assignedTo?.id);
      const mine = assignedToId && String(assignedToId) === String(myUserId);
      const active = (o.status || '').toLowerCase() !== 'delivered' && (o.status || '').toLowerCase() !== 'cancelled';
      return mine && active;
    });
  }, [orders, myUserId]);

  // Combine with backend flag for immediate correctness after refresh
  const hasActiveOrder = myActiveExists || hasActiveAssigned;

  // Badge colors
  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "order placed":
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusIcon = (status) => {
    switch ((status || "").toLowerCase()) {
      case "order placed":
      case "confirmed":
        return <FaClipboardList />;
      case "shipped":
        return <FaShippingFast />;
      case "delivered":
        return <FaCheckCircle />;
      case "cancelled":
        return <FaTimesCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  // Action buttons (dropdown / take order / assigned to other)
  const getActionButton = (order) => {
    const myId = localStorage.getItem("userId");
    const assignedToId =
      typeof order.assignedTo === "string"
        ? order.assignedTo
        : order.assignedTo?._id || order.assignedTo?.id || null;
    const changedByMe = Array.isArray(order.statusHistory)
      && order.statusHistory.some((h) => String(h.changedBy || '') === String(myId));

    const isAssignedToMe = !!myId && (
      (!!assignedToId && String(assignedToId) === String(myId)) || changedByMe
    );
    const noAssignee = !assignedToId; // Handle inconsistent data where isAssigned=true but assignedTo=null
    const isAssignedToSomeoneElse = order.isAssigned && !isAssignedToMe && !noAssignee;
    const status = order.status;

    // Case 1: Assigned to me → show action buttons instead of dropdown
    if (isAssignedToMe) {
      const isUpdating = updating[order._id]?.action === "status";
      const canShip = ["Order Placed", "Confirmed"].includes(status);
      const canDeliver = status === "Shipped";

      return (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateOrderStatus(order._id, "Shipped")}
            disabled={isUpdating || !canShip}
            className={`px-3 py-1 text-sm font-medium rounded-md text-white inline-flex items-center gap-2 transition ${
              isUpdating || !canShip
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <FaShippingFast /> {isUpdating && canShip ? "Updating..." : "Mark Shipped"}
          </button>
          <button
            onClick={() => updateOrderStatus(order._id, "Delivered")}
            disabled={isUpdating || !canDeliver}
            className={`px-3 py-1 text-sm font-medium rounded-md text-white inline-flex items-center gap-2 transition ${
              isUpdating || !canDeliver
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <FaCheckCircle /> {isUpdating && canDeliver ? "Updating..." : "Mark Delivered"}
          </button>
        </div>
      );
    }

    // Case 2: Not assigned (or inconsistent: isAssigned=true but no assignedTo)
    if (!order.isAssigned || noAssignee) {
      // If I already have an active order, prevent taking another
      if (hasActiveOrder) {
        return (
          <button
            disabled
            title="You already have an active order"
            className="px-3 py-1 text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed inline-flex items-center gap-2"
          >
            <FaClock /> Active order in progress
          </button>
        );
      }
      // else allow taking this order
      return (
        <button
          onClick={() => handleAssignOrder(order._id)}
          disabled={updating[order._id]?.action === "assign"}
          className={`px-3 py-1 text-sm font-medium rounded-md text-white inline-flex items-center gap-2 transition ${
            updating[order._id]?.action === "assign"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <FaBoxOpen /> {updating[order._id]?.action === "assign" ? "Assigning..." : "Take Order"}
        </button>
      );
    }

    // Case 3: Already assigned to someone else
    return (
      <span className="text-gray-500 text-sm" title={`Assigned to: ${order.assignedTo?.fullName || order.assignedTo?.name || assignedToId || 'unknown'}`}>
        Assigned to another labour
      </span>
    );
  };

  // Filter by page mode first (all/mine/pending), then by status tab
  const myId = localStorage.getItem("userId");
  const isDelivered = (s) => (s || "").toLowerCase() === "delivered";
  const isCancelled = (s) => (s || "").toLowerCase() === "cancelled";

  const modeFiltered = orders.filter((order) => {
    if (mode === "mine") {
      const assignedToId = typeof order.assignedTo === "string" ? order.assignedTo : (order.assignedTo?._id || order.assignedTo?.id);
      const changedByMe = Array.isArray(order.statusHistory)
        && order.statusHistory.some((h) => String(h.changedBy || '') === String(myId));
      return (
        !!myId && (
          (!!assignedToId && String(assignedToId) === String(myId)) || changedByMe
        )
      );
    }
    if (mode === "take") {
      // Only show orders that are NOT delivered/cancelled and currently unassigned (or inconsistent with no assignee)
      const s = (order.status || '').toLowerCase();
      const active = s !== 'delivered' && s !== 'cancelled';
      const assignedToId = typeof order.assignedTo === 'string' ? order.assignedTo : (order.assignedTo?._id || order.assignedTo?.id);
      const unassigned = !assignedToId; // treat missing assignedTo as unassigned
      return active && unassigned;
    }
    if (mode === "pending") {
      // Consider pending as any non-delivered and non-cancelled order
      return !isDelivered(order.status) && !isCancelled(order.status);
    }
    return true; // all
  });

  const filteredOrders = modeFiltered.filter(
    (order) =>
      (
        filter === "all"
          ? // In My Orders, optionally hide Delivered from the default "All" list
            !(mode === "mine" && hideDeliveredDefault && (order.status || "").toLowerCase() === "delivered")
          : (order.status || "").toLowerCase() === filter.toLowerCase()
      )
  );

  // Finished count (Delivered) for My Orders
  const finishedCount = useMemo(() => {
    if (!myUserId) return 0;
    return orders.filter((o) => {
      const assignedToId = typeof o.assignedTo === 'string' ? o.assignedTo : (o.assignedTo?._id || o.assignedTo?.id);
      const mine = assignedToId && String(assignedToId) === String(myUserId);
      return mine && (o.status || '').toLowerCase() === 'delivered';
    }).length;
  }, [orders, myUserId]);

  const toggleExpand = (orderId) => {
    setExpanded((prev) => (prev === orderId ? null : orderId));
  };

  const formatDateTime = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  };

  // If My Orders 'All' is empty only because Delivered is hidden by default,
  // automatically switch to the Delivered tab so the user sees their completed orders.
  useEffect(() => {
    if (mode !== 'mine' || !hideDeliveredDefault) return;
    // Compute what 'All' shows with the current rules
    const hasAnyDeliveredMine = orders.some((o) => {
      const assignedToId = typeof o.assignedTo === 'string' ? o.assignedTo : (o.assignedTo?._id || o.assignedTo?.id);
      const mine = myUserId && assignedToId && String(assignedToId) === String(myUserId);
      return mine && (o.status || '').toLowerCase() === 'delivered';
    });
    const hasAnyNonDeliveredMine = orders.some((o) => {
      const assignedToId = typeof o.assignedTo === 'string' ? o.assignedTo : (o.assignedTo?._id || o.assignedTo?.id);
      const mine = myUserId && assignedToId && String(assignedToId) === String(myUserId);
      const s = (o.status || '').toLowerCase();
      return mine && s !== 'delivered' && s !== 'cancelled';
    });
    if (filter === 'all' && !hasAnyNonDeliveredMine && hasAnyDeliveredMine) {
      setFilter('delivered');
    }
  }, [orders, mode, hideDeliveredDefault, myUserId, filter]);

  // Loading spinner conditional return
  if (loading) {
    // This assumes the Preloader component exists and is a full-page loading screen
    return <Preloader />;
    // If Preloader is not desired, the simple spinner you commented out is an option:
    // return (
    //   <div className="flex items-center justify-center min-h-screen">
    //     <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
    //   </div>
    // );
  }

  return (
    <PageContainer>
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-2">
          {mode === 'take' ? (
            <>
              <FaBoxOpen className="text-green-600" /> Take Orders
            </>
          ) : (
            <>
              <FaClipboardList className="text-gray-100" /> Order Management
            </>
          )}
        </h1>
        <p className="text-gray-200 mt-2">
          {mode === 'take' ? 'Browse available orders and take one to work on' : 'Manage and track your assigned orders'}
        </p>
        {showFinishedSummary && mode === "mine" && (
          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <FaCheckCircle className="mr-1" /> Finished: {finishedCount}
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-100">
          <nav className="-mb-px flex flex-wrap gap-4">
            {(mode === 'take'
              ? [
                  { key: "all", label: "All", icon: <FaBoxOpen /> },
                  { key: "confirmed", label: "Confirmed", icon: <FaClipboardList /> },
                  { key: "shipped", label: "Shipped", icon: <FaTruck /> },
                ] // hide Delivered in take mode
              : [
                  { key: "all", label: "All", icon: <FaBoxOpen /> },
                  { key: "confirmed", label: "Confirmed", icon: <FaClipboardList /> },
                  { key: "shipped", label: "Shipped", icon: <FaTruck /> },
                  { key: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
                ]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-2 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition ${
                  filter === tab.key
                    ? "border-blue-900 text-blue-400"
                    : "border-transparent text-gray-100 hover:text-gray-100 hover:border-gray-100"
                }`}
                title={`Show ${tab.label} orders`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="capitalize">{tab.label}</span>
                <span className="text-xs text-gray-100">
                  (
                  {
                    tab.key === "all"
                      ? modeFiltered.filter((o) =>
                          !(mode === "mine" && hideDeliveredDefault && (o.status || "").toLowerCase() === "delivered")
                        ).length
                      : modeFiltered.filter((o) => (o.status || "").toLowerCase() === tab.key).length
                  }
                  )
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Delivery Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <>
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{order._id?.slice(-6)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {order.products?.length || 0} items
                            </div>
                          </div>
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 text-sm"
                            title={expanded === order._id ? 'Hide details' : 'View details'}
                          >
                            <FaInfoCircle /> {expanded === order._id ? 'Hide' : 'Details'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <span className="inline-flex items-center gap-2"><FaUser className="text-gray-500" />{order.buyer?.fullName || "N/A"}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.buyer?.email || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1"><FaPhone /> {order.buyer?.phone || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          <div className="font-medium">
                            {order.address?.fullName ||
                              order.buyer?.fullName ||
                              "N/A"}
                          </div>
                          <div className="text-gray-600 flex items-start gap-2"><FaMapMarkerAlt className="mt-0.5" /> <span>{order.address?.street || ""}</span></div>
                          <div className="text-gray-600">
                            {order.address?.city}
                            {order.address?.city ? ", " : ""}
                            {order.address?.state}
                          </div>
                          <div className="text-gray-600">
                            {order.address?.zip}
                          </div>
                          {(order.address?.phone || order.buyer?.phone) && (
                            <div className="text-gray-600 font-medium">
                              <span className="inline-flex items-center gap-1"><FaPhone /> {order.address?.phone || order.buyer?.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <span className="inline-flex items-center gap-1">{statusIcon(order.status)} {order.status}</span>
                          </span>
                          {(() => {
                            const myId = localStorage.getItem('userId');
                            const assignedToId = typeof order.assignedTo === 'string' ? order.assignedTo : (order.assignedTo?._id || order.assignedTo?.id);
                            const mine = myId && assignedToId && String(assignedToId) === String(myId);
                            if (mine) {
                              return <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">Assigned to you</span>;
                            }
                            if (!assignedToId) {
                              return <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">Unassigned</span>;
                            }
                            return <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">Assigned</span>;
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center gap-1"><FaRupeeSign />{order.total}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {getActionButton(order)}
                      </td>
                    </tr>
                    {expanded === order._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">Products</h4>
                              <ul className="space-y-2">
                                {(order.products || []).map((p, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex justify-between">
                                    <span>{p.product?.name || p.name || 'Item'}</span>
                                    <span className="text-gray-500">x {p.quantity || p.qty || p.count || 1}</span>
                                  </li>
                                ))}
                                {!(order.products || []).length && (
                                  <li className="text-sm text-gray-500">No products</li>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">Payment</h4>
                              <div className="text-sm text-gray-700">Method: {order.paymentMethod || 'N/A'}</div>
                              <div className="text-sm text-gray-700">Total: ₹{order.total}</div>
                              <div className="text-sm text-gray-700">Order ID: {order._id}</div>
                              <div className="text-sm text-gray-700 mt-2">
                                Taken by: {(() => {
                                  const at = order.assignedTo;
                                  const label = at?.fullName || at?.name || at?._id || 'N/A';
                                  const myId = localStorage.getItem('userId');
                                  return (at && myId && String(at._id || at.id) === String(myId)) ? 'You' : label;
                                })()}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">Status History</h4>
                              <ol className="border-l border-gray-300 pl-4 space-y-2">
                                {(order.statusHistory || []).map((h, i) => {
                                  const when = h.updatedAt || h.changedAt || h.timestamp;
                                  const whoId = h.changedBy;
                                  const myId = localStorage.getItem('userId');
                                  const whoLabel = whoId ? (String(whoId) === String(myId) ? 'You' : String(whoId)) : '';
                                  return (
                                    <li key={i} className="text-sm text-gray-700">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${getStatusColor(h.status)}`}>
                                          <span className="inline-flex items-center gap-1">{statusIcon(h.status)} {h.status}</span>
                                        </span>
                                        {when && (
                                          <span className="text-xs text-gray-500">{formatDateTime(when)}</span>
                                        )}
                                        {whoLabel && (
                                          <span className="text-xs text-gray-500">by {whoLabel}</span>
                                        )}
                                      </div>
                                    </li>
                                  );
                                })}
                                {!order.statusHistory?.length && (
                                  <li className="text-sm text-gray-500">No history available</li>
                                )}
                              </ol>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all"
                ? (mode === 'mine' ? "You have no orders yet." : "No orders available.")
                : `No ${filter} orders found.`}
            </p>
          </div>
        )}
      </div>
    </div>
    </PageContainer>
  );
};

export default OrderList;