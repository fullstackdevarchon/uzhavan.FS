// src/pages/Admin/SelectedProducts.jsx
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const SelectedProducts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLimits, setEditingLimits] = useState({});

  // ✅ Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/v1/categories/all", {
        withCredentials: true,
      });

      if (data?.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
        toast.error("Invalid data format received from server");
      }
    } catch (error) {
      setCategories([]);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ✅ Toggle category enable/disable
  const handleToggle = async (id) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/v1/categories/${id}/toggle`,
        {},
        { withCredentials: true }
      );

      if (data?.success && data.category) {
        setCategories((prev) =>
          prev.map((c) => (c._id === id ? data.category : c))
        );
        toast.success(data.message || "Category updated");
      } else {
        toast.error("Toggle failed: invalid response");
      }
    } catch (error) {
      toast.error("Failed to toggle category");
    }
  };

  // ✅ Handle input typing (local state only)
  const handleLimitChange = (id, value) => {
    setEditingLimits((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ✅ Save limit to backend
  const handleSaveLimit = async (id) => {
    try {
      const newLimit = editingLimits[id];
      if (!newLimit || newLimit < 1) {
        toast.error("Limit must be at least 1");
        return;
      }

      const { data } = await axios.patch(
        `http://localhost:5000/api/v1/categories/${id}/limit`,
        { limit: Number(newLimit) },
        { withCredentials: true }
      );

      if (data?.success && data.category) {
        setCategories((prev) =>
          prev.map((c) => (c._id === id ? data.category : c))
        );
        toast.success(data.message || "Limit updated");

        // ✅ Clear editing state for this category
        setEditingLimits((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      } else {
        toast.error("Update failed: invalid response");
      }
    } catch (error) {
      toast.error("Failed to update limit");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold mb-6">Category Management</h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found</p>
          ) : (
            <div className="grid gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  {/* Left side */}
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p
                      className={`text-sm ${
                        category.enabled ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {category.enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>

                  {/* Right side (controls) */}
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={editingLimits[category._id] ?? category.limit}
                      onChange={(e) =>
                        handleLimitChange(category._id, e.target.value)
                      }
                      className="w-20 px-2 py-1 border rounded"
                    />

                    {editingLimits[category._id] !== undefined && (
                      <button
                        onClick={() => handleSaveLimit(category._id)}
                        className="px-3 py-1 rounded bg-blue-500 text-white"
                      >
                        Save
                      </button>
                    )}

                    <button
                      onClick={() => handleToggle(category._id)}
                      className={`px-4 py-2 rounded-lg text-white ${
                        category.enabled ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {category.enabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectedProducts;
