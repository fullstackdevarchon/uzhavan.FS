// src/pages/Seller/MyProducts.jsx
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const MyProducts = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Catch Red Chilli Powder",
      price: 109.95,
      weight: "200g",
      image:
        "https://catchfoods.com/wp-content/uploads/2023/07/Catch-Spices-Red-Chilli-Powder.webp",
      stock: 50,
      sold: 120,
    },
    {
      id: 2,
      title: "Fresh Apples",
      price: 120,
      weight: "1kg",
      image:
        "https://freshindiaorganics.com/cdn/shop/products/Apples.jpg?v=1686739530",
      stock: 80,
      sold: 200,
    },
    {
      id: 3,
      title: "Bananas",
      price: 40,
      weight: "1kg",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsgl23VQ1a5UFjTkar62Fcl0Sqi2d3derxrA&s",
      stock: 100,
      sold: 150,
    },
    {
      id: 4,
      title: "Potatoes",
      price: 25,
      weight: "1kg",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROJLyBfS8fKMRSo3QOXGV1gjRHZtIR0PyraQ&s",
      stock: 200,
      sold: 300,
    },
    {
      id: 5,
      title: "Onions",
      price: 35,
      weight: "1kg",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEZraUx3lKNHLngu5S8M2E-PINk9Bg8MOOkw&s",
      stock: 150,
      sold: 250,
    },
  ]);

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800 text-center">
        📦 My Products
      </h2>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-gray-500 text-center">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-2xl shadow-lg flex flex-col bg-white hover:shadow-2xl transition overflow-hidden"
              >
                {/* Image */}
                <div className="w-full h-56 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-lg font-bold text-green-600 mb-2">
                    ₹{product.price}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Weight:</strong> {product.weight}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Stock:</strong> {product.stock}
                  </p>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong>Sold:</strong> {product.sold}
                  </p>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="mt-auto flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default MyProducts;
