// src/pages/Seller/MyProducts.jsx
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seller products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // seller token
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/products/seller",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("❌ Product fetch error:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("❌ Product delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800 text-center">
        📦 My Products
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-2xl shadow-lg flex flex-col bg-white hover:shadow-2xl transition overflow-hidden"
            >
              {/* Image */}
              <div className="w-full h-56 bg-gray-100">
                <img
                  src={
                    typeof product.image === "object"
                      ? product.image.url
                      : product.image
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image")
                  }
                />
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-green-600 mb-2">
                  ₹{product.price}
                </p>

                {product.weight && (
                  <p className="text-gray-700 text-sm">
                    <strong>Weight:</strong> {product.weight}
                  </p>
                )}

                <div className="flex justify-between text-sm mt-2 mb-3">
                  <span className="text-blue-600 font-semibold">
                    Stock: {product.quantity}
                  </span>
                  <span className="text-purple-600 font-semibold">
                    Sold: {product.sold || 0}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(product._id)}
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
