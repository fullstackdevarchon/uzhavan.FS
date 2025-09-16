import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaChartPie, FaBoxOpen } from "react-icons/fa";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

const Analytics = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/v1/orders/admin/all", {
          withCredentials: true, // ✅ ensure cookies/JWT are sent
        });

        if (data.success && data.orders) {
          // ✅ Only delivered orders
          const deliveredOrders = data.orders.filter(
            (o) => o.status === "Delivered"
          );

          const categoryMap = {};
          const productMap = {};

          deliveredOrders.forEach((order) => {
            order.products.forEach((item) => {
              const p = item.product;
              if (!p) return;

              // Group by category
              if (p.category) {
                if (!categoryMap[p.category]) categoryMap[p.category] = 0;
                categoryMap[p.category] += item.qty;
              }

              // Group by product
              if (!productMap[p._id]) {
                productMap[p._id] = {
                  id: p._id,
                  title: p.name || "Unknown",
                  sold: 0,
                };
              }
              productMap[p._id].sold += item.qty;
            });
          });

          // ✅ Pie chart data
          const categoryChartData = Object.keys(categoryMap).map((key) => ({
            name: key,
            value: categoryMap[key],
          }));
          setCategoryData(categoryChartData);

          // ✅ Top 5 products
          const productArray = Object.values(productMap);
          const sortedProducts = productArray.sort((a, b) => b.sold - a.sold);
          setTopProducts(sortedProducts.slice(0, 5));
        }
      } catch (err) {
        console.error("❌ Analytics fetch error:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-800 tracking-wide drop-shadow-sm">
        📊 Analytics Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Pie chart for category sales */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaChartPie className="text-blue-600 text-xl" />
            <h3 className="text-xl font-semibold text-gray-800">
              Sales by Category
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart for top selling products */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaBoxOpen className="text-green-600 text-xl" />
            <h3 className="text-xl font-semibold text-gray-800">
              Top Selling Products
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <XAxis dataKey="title" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#00C49F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Product list */}
          <ul className="mt-6 space-y-3">
            {topProducts.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-white shadow rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
              >
                <span className="truncate w-2/3">{p.title}</span>
                <span className="text-green-700 font-bold">{p.sold} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
