import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBalanceScale,
  FaBoxes,
} from "react-icons/fa";

function CheckStatus() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Replace with API fetch call if needed
    const products = [
      {
        id: 1,
        title: "Catch Red Chilli Powder",
        price: 109.95,
        weight: "500g",
        quantity: 10,
        category: "spices",
        image:
          "https://catchfoods.com/wp-content/uploads/2023/07/Catch-Spices-Red-Chilli-Powder.webp",
        status: "Pending",
        adminResponse: "Awaiting review from admin",
      },
      {
        id: 2,
        title: "Catch Coriander Powder",
        price: 22.3,
        weight: "250g",
        quantity: 20,
        category: "spices",
        image: "https://m.media-amazon.com/images/I/7154zLsH36L.jpg",
        status: "Accepted",
        adminResponse: "Approved for sale",
      },
      {
        id: 3,
        title: "Catch Turmeric Powder",
        price: 35.5,
        weight: "1kg",
        quantity: 15,
        category: "spices",
        image:
          "https://www.bbassets.com/media/uploads/p/xl/30006777_6-catch-turmeric-powder.jpg",
        status: "Rejected",
        adminResponse: "Image quality not sufficient",
      },
      {
        id: 5,
        title: "Fresh Apples",
        price: 120,
        weight: "2kg",
        quantity: 25,
        category: "fruits",
        image:
          "https://freshindiaorganics.com/cdn/shop/products/Apples.jpg?v=1686739530",
        status: "Pending",
        adminResponse: "Waiting for admin approval",
      },
      {
        id: 7,
        title: "Fresh Mangoes",
        price: 150,
        weight: "5kg",
        quantity: 12,
        category: "fruits",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbQwrS6BBEsCutkygv4uQ-zGcgj3WQWHMfMA&s",
        status: "Accepted",
        adminResponse: "Product verified successfully",
      },
    ];
    setOrders(products);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="flex items-center gap-2 text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm font-semibold">
            <FaClock /> {status}
          </span>
        );
      case "Accepted":
        return (
          <span className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
            <FaCheckCircle /> {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="flex items-center gap-2 text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-semibold">
            <FaTimesCircle /> {status}
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Status</h2>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
          >
            {/* Product Image */}
            <img
              src={order.image}
              alt={order.title}
              className="w-full h-40 object-contain bg-gray-50"
            />

            {/* Product Info */}
            <div className="p-4 flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                {order.title}
              </h3>
              <p className="text-sm text-gray-500 capitalize mb-2">
                {order.category}
              </p>
              <p className="text-gray-900 font-bold mb-3">₹{order.price}</p>

              {/* Weight & Quantity */}
              <div className="flex items-center justify-between mb-3 text-sm text-gray-700">
                <span className="flex items-center gap-2">
                  <FaBalanceScale className="text-gray-500" />{" "}
                  <span className="font-medium">Weight:</span> {order.weight}
                </span>
                <span className="flex items-center gap-2">
                  <FaBoxes className="text-gray-500" />{" "}
                  <span className="font-medium">Qty:</span> {order.quantity}
                </span>
              </div>

              {/* Status */}
              <div className="mb-3">{getStatusBadge(order.status)}</div>

              {/* Admin Response */}
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Admin:</span>{" "}
                {order.adminResponse}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckStatus;
