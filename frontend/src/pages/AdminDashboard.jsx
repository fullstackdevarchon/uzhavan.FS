import React from "react";
import { Link } from "react-router-dom";
import { 
  FaBoxes, 
  FaUserCog, 
  FaChartBar, 
  FaWarehouse, 
  FaShoppingCart, 
  FaUsers 
} from "react-icons/fa";

const AdminDashboard = () => {
  // Example stats - you can replace these with real data later
  const stats = {
    totalProducts: 150,
    totalOrders: 45,
    pendingSellers: 8,
    totalRevenue: "₹45,000",
    activeUsers: 250,
    inventoryItems: 180
  };

  // Dashboard cards configuration
  const dashboardCards = [
    {
      title: "Products",
      count: stats.totalProducts,
      icon: FaBoxes,
      link: "/admin-dashboard/products",
      color: "blue"
    },
    {
      title: "Pending Sellers",
      count: stats.pendingSellers,
      icon: FaUserCog,
      link: "/admin-dashboard/seller-requests",
      color: "purple"
    },
    {
      title: "Analytics",
      count: stats.totalRevenue,
      icon: FaChartBar,
      link: "/admin-dashboard/analytics",
      color: "green"
    },
    {
      title: "Inventory",
      count: stats.inventoryItems,
      icon: FaWarehouse,
      link: "/admin-dashboard/inventory",
      color: "yellow"
    },
    {
      title: "Orders",
      count: stats.totalOrders,
      icon: FaShoppingCart,
      link: "/admin-dashboard/orders",
      color: "pink"
    },
    {
      title: "Active Users",
      count: stats.activeUsers,
      icon: FaUsers,
      link: "/admin-dashboard/analytics",
      color: "indigo"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600">Here's what's happening in your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 bg-white border-t-4 hover:shadow-xl`}
            style={{ borderColor: getColor(card.color) }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.count}</p>
              </div>
              <card.icon className="text-3xl" style={{ color: getColor(card.color) }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/admin-dashboard/products'}
            className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaBoxes />
            Manage Products
          </button>
          <button
            onClick={() => window.location.href = '/admin-dashboard/seller-requests'}
            className="flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FaUserCog />
            Review Seller Requests
          </button>
          <button
            onClick={() => window.location.href = '/admin-dashboard/orders'}
            className="flex items-center justify-center gap-2 p-3 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
          >
            <FaShoppingCart />
            View Recent Orders
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-gray-600">New seller registration request received</p>
            <span className="text-sm text-gray-400 ml-auto">2 mins ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-gray-600">10 new orders placed</p>
            <span className="text-sm text-gray-400 ml-auto">15 mins ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-gray-600">Inventory alert: 5 products low in stock</p>
            <span className="text-sm text-gray-400 ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color values
const getColor = (color) => {
  const colors = {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    green: '#10B981',
    yellow: '#F59E0B',
    pink: '#EC4899',
    indigo: '#6366F1'
  };
  return colors[color] || colors.blue;
};

export default AdminDashboard;
