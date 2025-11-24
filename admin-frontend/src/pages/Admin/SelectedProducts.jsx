import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  Power,
  PowerOff,
} from "lucide-react";
import PageContainer from "../../components/PageContainer";
import Preloader from "../../components/Preloader";

const SelectedProducts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLimits, setEditingLimits] = useState({});
  const [showPreloader, setShowPreloader] = useState(true);

  /* =====================================================
     ✅ Initial Preloader (2 seconds)
  ===================================================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000); // show preloader for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  /* =====================================================
     ✅ Fetch Categories
  ===================================================== */
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/categories/all",
        { withCredentials: true }
      );

      if (data?.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        toast.error("⚠️ Invalid response from server.");
      }
    } catch (error) {
      toast.error("❌ Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* =====================================================
     ✅ Toggle Category (Enable/Disable)
  ===================================================== */
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
        toast.success(`🎉 ${data.message}`);
      } else {
        toast.error("❌ Toggle failed. Invalid response.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to toggle category";
      toast.error("⚠️ " + msg);
      console.error("Toggle Error:", error.response?.data || error.message);
    }
  };

  /* =====================================================
     ✅ Handle Limit Input (local edit)
  ===================================================== */
  const handleLimitChange = (id, value) => {
    setEditingLimits((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  /* =====================================================
     ✅ Save Limit Update
  ===================================================== */
  const handleSaveLimit = async (id) => {
    try {
      const newLimit = Number(editingLimits[id]);
      if (!newLimit || newLimit < 1) {
        toast.error("⚠️ Limit must be at least 1");
        return;
      }

      const { data } = await axios.patch(
        `http://localhost:5000/api/v1/categories/${id}/limit`,
        { limit: newLimit },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data?.success && data.category) {
        setCategories((prev) =>
          prev.map((c) => (c._id === id ? data.category : c))
        );
        toast.success(`✅ ${data.message}`);

        // Clear editing state
        setEditingLimits((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      } else {
        toast.error("❌ Update failed: Invalid response");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Error updating limit";
      toast.error("⚠️ " + msg);
    }
  };

  /* =====================================================
     ✅ Show Preloader before main UI
  ===================================================== */
  // if (showPreloader) {
  //   return <Preloader />;
  // }

  /* =====================================================
     ✅ UI Layout
  ===================================================== */
  return (
    <PageContainer>
      <div className="p-6">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#fff",
              color: "#333",
              borderRadius: "12px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              padding: "12px 18px",
              fontWeight: 500,
            },
          }}
        />

        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-3xl font-bold text-gray-100 mb-8 flex items-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🗂️ Category Management
          </motion.h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin w-12 h-12 text-indigo-600" />
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    className="p-5 rounded-2xl border shadow-md bg-white hover:shadow-xl transition-all duration-300 relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {category.name}
                        </h3>
                        <p
                          className={`text-sm mt-1 font-medium ${
                            category.enabled
                              ? "text-green-900"
                              : "text-red-900"
                          }`}
                        >
                          {category.enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {category.enabled ? (
                          <CheckCircle className="text-green-500 w-5 h-5" />
                        ) : (
                          <XCircle className="text-red-400 w-5 h-5" />
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p>Group: {category.group || "Not assigned"}</p>
                      <p>Limit: {category.limit}</p>
                    </div>

                    {/* Limit Input */}
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="number"
                        min="1"
                        value={editingLimits[category._id] ?? category.limit}
                        onChange={(e) =>
                          handleLimitChange(category._id, e.target.value)
                        }
                        className="w-20 px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      {editingLimits[category._id] !== undefined && (
                        <button
                          onClick={() => handleSaveLimit(category._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all"
                        >
                          <Save size={16} /> Save
                        </button>
                      )}
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggle(category._id)}
                      className={`w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-white font-medium shadow-md transition-all ${
                        category.enabled
                          ? "bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-pink-600"
                          : "bg-gradient-to-r from-green-500 to-green-500 hover:from-green-600 hover:to-emerald-600"
                      }`}
                    >
                      {category.enabled ? (
                        <>
                          <PowerOff size={18} /> Disable
                        </>
                      ) : (
                        <>
                          <Power size={18} /> Enable
                        </>
                      )}
                    </button>

                    {/* Animated underline */}
                    <motion.div
                      className={`absolute bottom-0 left-0 h-1 ${
                        category.enabled ? "bg-green-400" : "bg-red-300"
                      }`}
                      layoutId="underline"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default SelectedProducts;
