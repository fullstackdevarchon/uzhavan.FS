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
    quantity: "",
    description: "",
    image: null,
    category: "", // Add this line
  });

  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/categories/enabled", {
          credentials: "include"
        });
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalWeight =
        form.weight === "custom" ? form.customWeight : form.weight;

      // Create FormData
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("weight", finalWeight);
      formData.append("quantity", form.quantity);
      formData.append("description", form.description);
      formData.append("category", form.category); // Add this line
      if (form.image) {
        formData.append("image", form.image);
      }

      // Updated API endpoint
      const response = await fetch("http://localhost:5000/api/v1/products/create", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          // Don't set Content-Type with FormData
          // Browser will set it automatically with boundary
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error adding product");
      }

      toast.success("✅ Product submitted for approval!");

      // Reset form
      setForm({
        name: "",
        price: "",
        weight: "",
        customWeight: "",
        quantity: "",
        description: "",
        image: null,
        category: "", // Reset category
      });
      setPreview(null);

      // Redirect to products list
      navigate("/seller/my-products");
    } catch (error) {
      toast.error(error.message || "Failed to add product");
      console.error("Add product error:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayWeight =
    form.weight === "custom" ? form.customWeight : form.weight;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800 text-center">
        ➕ Add New Product
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Form */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Weight + Quantity */}
            <div className="grid grid-cols-2 gap-4">
              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <FaBalanceScale className="text-gray-500" /> Weight
                </label>
                <select
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select Weight</option>
                  <option value="250g">250 g</option>
                  <option value="500g">500 g</option>
                  <option value="1kg">1 kg</option>
                  <option value="2kg">2 kg</option>
                  <option value="custom">Custom</option>
                </select>

                {/* Custom Weight Input */}
                {form.weight === "custom" && (
                  <input
                    type="text"
                    name="customWeight"
                    value={form.customWeight}
                    onChange={handleChange}
                    placeholder="Enter custom weight (e.g., 750g, 5kg)"
                    className="mt-2 w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <FaBoxes className="text-gray-500" /> Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  required
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>
              <label className="flex items-center justify-center gap-3 cursor-pointer border border-dashed p-4 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-sm sm:text-base">
                <FaUpload className="text-gray-500" />
                <span className="text-gray-600">Upload Product Image</span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all`}
            >
              {loading ? "Adding Product..." : "➕ Add Product"}
            </button>
          </form>
        </div>

        {/* Product Preview */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt="Product Preview"
              className="w-48 h-48 object-cover rounded-xl border mb-4"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed rounded-xl text-gray-400">
              No Image
            </div>
          )}

          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-gray-800">
              {form.name || "Product Name"}
            </h3>
            <p className="text-yellow-600 text-lg font-semibold">
              {form.price ? `₹${form.price}` : "Price"}
            </p>
            <p className="text-gray-600 text-sm">
              ⚖️ {displayWeight || "Weight"}
            </p>
            <p className="text-gray-600 text-sm">📦 {form.quantity || "Qty"}</p>
            <p className="text-gray-600 text-sm">
              📑 {categories.find(c => c.id === form.category)?.name || "Category"}
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
