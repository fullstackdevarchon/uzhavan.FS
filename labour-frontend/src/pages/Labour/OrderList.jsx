import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/labour/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/labour/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
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

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return "confirmed";
      case "confirmed":
        return "shipped";
      case "shipped":
        return "delivered";
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">Manage and track your assigned orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["all", "pending", "confirmed", "shipped", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  filter === status
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {status} ({orders.filter(o => status === "all" || o.status === status).length})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id?.slice(-6)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <div className="font-medium">{order.shippingAddress?.name}</div>
                        <div className="text-gray-600">
                          {order.shippingAddress?.address}
                        </div>
                        <div className="text-gray-600">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </div>
                        <div className="text-gray-600">
                          {order.shippingAddress?.pincode}
                        </div>
                        {order.shippingAddress?.phone && (
                          <div className="text-gray-600 font-medium">
                            📞 {order.shippingAddress.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {getNextStatus(order.status) && (
                        <button
                          onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                          disabled={updating[order._id]}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white ${
                            updating[order._id]
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          {updating[order._id] ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></div>
                              Updating...
                            </div>
                          ) : (
                            `Mark as ${getNextStatus(order.status)}`
                          )}
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <span className="text-green-600 text-xs font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all" 
                ? "No orders have been assigned to you yet." 
                : `No ${filter} orders found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
