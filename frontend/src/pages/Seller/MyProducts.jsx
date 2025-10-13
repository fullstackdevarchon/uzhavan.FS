// src/pages/Seller/MyProducts.jsx
import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaTimes } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStock, setNewStock] = useState("");

  // Fetch seller products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/v1/products/seller", {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  // Open edit modal
  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewStock(product.quantity);
  };

  // Update stock API call
  const handleUpdateStock = async () => {
    if (!newStock || isNaN(newStock)) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/v1/products/${editingProduct._id}`,
        { quantity: newStock },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Stock updated successfully!");
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id ? { ...p, quantity: newStock } : p
          )
        );
        setEditingProduct(null);
      } else {
        toast.error("Failed to update stock");
      }
    } catch (error) {
      console.error("❌ Stock update error:", error);
      toast.error("Failed to update stock");
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

                <div className="flex gap-2 mt-auto">
                  {/* Update Button */}
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex-1"
                  >
                    <FaEdit /> Update Stock
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Stock Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Update Stock
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-600 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{editingProduct.name}</p>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="border w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4"
              placeholder="Enter new stock quantity"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
