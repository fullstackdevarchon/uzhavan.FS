// src/pages/Seller/AddProduct.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaUpload, FaBalanceScale, FaBoxes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    weight: "",
    customWeight: "",
    quantity: 1,
    description: "",
    image: null,
    category: "",
  });
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ============================
  // Fetch Categories
  // ============================
  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/v1/categories/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories.filter((c) => c.enabled));
        } else toast.error(data.message || "Failed to load categories");
      } catch {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [token]);

  // ============================
  // Handle Form Changes
  // ============================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else if (name === "quantity") {
      setForm({ ...form, quantity: Math.max(1, parseInt(value)) });
    } else if (name === "weight" || name === "customWeight") {
      if (value.startsWith("-")) return;
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ============================
  // Handle Form Submit
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "seller") {
      toast.error("🚫 Only sellers can add products");
      return;
    }

    setLoading(true);
    try {
      if (!form.category) throw new Error("Please select a category");
      const finalWeight = form.weight === "custom" ? form.customWeight : form.weight;
      if (!finalWeight) throw new Error("Please select or enter product weight");
      if (!form.image) throw new Error("Please upload a product image");

      const formData = new FormData();
      Object.entries({ ...form, weight: finalWeight }).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const res = await fetch("http://localhost:5000/api/v1/products/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add product");

      toast.success("✅ Product submitted for approval!");

      // ============================
      // Send notification to admin
      // ============================
      if (window.socket && window.socket.connected) {
        window.socket.emit("sendNotification", {
          role: "admin",
          title: "New Product Request",
          message: `Seller ${user.fullName} submitted a new product: ${data.product.name}`,
        });
        console.log("🔔 Notification emitted to admin");
      }

      // Reset Form
      setForm({
        name: "",
        price: "",
        weight: "",
        customWeight: "",
        quantity: 1,
        description: "",
        image: null,
        category: "",
      });
      setPreview(null);
      navigate("/seller/my-products");
    } catch (error) {
      toast.error(error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const displayWeight = form.weight === "custom" ? form.customWeight : form.weight;

  // ============================
  // Render
  // ============================
  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800 text-center">
        ➕ Add New Product
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Weight & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <FaBalanceScale className="text-gray-500" /> Weight
                </label>
                <select
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Weight</option>
                  <option value="250g">250 g</option>
                  <option value="500g">500 g</option>
                  <option value="1kg">1 kg</option>
                  <option value="2kg">2 kg</option>
                  <option value="custom">Custom</option>
                </select>
                {form.weight === "custom" && (
                  <input
                    type="text"
                    name="customWeight"
                    value={form.customWeight}
                    onChange={handleChange}
                    placeholder="Enter custom weight"
                    className="mt-2 w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <FaBoxes className="text-gray-500" /> Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
              <label className="flex items-center justify-center gap-3 cursor-pointer border border-dashed p-4 rounded-lg hover:border-blue-500 hover:bg-blue-50">
                <FaUpload className="text-gray-500" />
                <span className="text-gray-600">Upload Product Image</span>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-3 rounded-lg font-semibold transition-all`}
            >
              {loading ? "Adding Product..." : "➕ Add Product"}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 flex flex-col items-center">
          {preview ? (
            <img src={preview} alt="Product Preview" className="w-48 h-48 object-cover rounded-xl border mb-4" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed rounded-xl text-gray-400">
              No Image
            </div>
          )}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-gray-800">{form.name || "Product Name"}</h3>
            <p className="text-yellow-600 text-lg font-semibold">{form.price ? `₹${form.price}` : "Price"}</p>
            <p className="text-gray-600 text-sm">⚖️ {displayWeight || "Weight"}</p>
            <p className="text-gray-600 text-sm">📦 {form.quantity || 1}</p>
            <p className="text-gray-600 text-sm">
              📑 {categories.find((c) => c._id === form.category)?.name || "Category"}
            </p>
            <p className="text-gray-500 text-sm italic mt-2">
              {form.description || "Product description will appear here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
