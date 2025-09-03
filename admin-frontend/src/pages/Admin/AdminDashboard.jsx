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
      color: "red"
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <Link 
            key={index}
            to={card.link}
            className={`p-6 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 bg-white border-t-4 border-${card.color}-500`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">{card.title}</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900">{card.count}</p>
              </div>
              <card.icon className={`text-${card.color}-500 text-3xl`} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
