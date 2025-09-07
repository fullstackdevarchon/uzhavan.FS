// src/pages/Admin/ProductListAdmin.jsx
import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaTrash, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const ProductListAdmin = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // ✅ Fetch products from backend (only approved)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/v1/products/all", {
        withCredentials: true,
      });

      if (data.success) {
        const approved = data.products.filter((p) => p.status === "approved");
        setData(approved);
        setFilter(approved);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch categories (enabled only)
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/v1/categories/all", {
        withCredentials: true,
      });

      if (data.success) {
        const enabled = data.categories.filter((c) => c.enabled);
        setCategories(enabled);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Filter products by category
  const filterProduct = (catId, catName) => {
    setCategory(catName);
    setDropdownOpen(false);

    if (catName === "All") {
      setFilter(data);
    } else {
      setFilter(data.filter((item) => item.category?._id === catId));
    }
  };

  // ✅ Delete product (backend + state update)
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/products/${id}`, {
          withCredentials: true,
        });

        const updatedData = data.filter((item) => item._id !== id);
        setData(updatedData);

        if (category === "All") {
          setFilter(updatedData);
        } else {
          setFilter(
            updatedData.filter((item) => item.category?.name === category)
          );
        }

        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting product");
      }
    }
  };

  // ✅ Skeleton loader
  const Loading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="border rounded-xl p-6 shadow-lg bg-white min-h-[420px]"
        >
          <Skeleton height={220} />
          <Skeleton className="mt-4" count={3} />
        </div>
      ))}
    </div>
  );

  // ✅ Render approved products
  const ShowProducts = () => (
    <>
      {/* Category Filter */}
      <div className="flex justify-center mb-8" ref={dropdownRef}>
        <div className="relative w-64">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 py-3 text-lg text-gray-700 font-semibold hover:border-gray-800 flex justify-between items-center"
          >
            {category === "All"
              ? "All Categories"
              : category.charAt(0).toUpperCase() + category.slice(1)}
            <FaChevronDown className="ml-2 text-gray-500" />
          </button>
          {dropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
              <div
                onClick={() => filterProduct(null, "All")}
                className="cursor-pointer px-4 py-3 hover:bg-gray-100 text-lg transition"
              >
                All Categories
              </div>
              {categories.map((catOption) => (
                <div
                  key={catOption._id}
                  onClick={() => filterProduct(catOption._id, catOption.name)}
                  className="cursor-pointer px-4 py-3 hover:bg-gray-100 text-lg transition"
                >
                  {catOption.name.charAt(0).toUpperCase() + catOption.name.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filter.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden relative flex flex-col h-full group border border-gray-200"
          >
            {/* Delete button on hover */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => deleteProduct(product._id)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg flex items-center justify-center"
              >
                <FaTrash />
              </button>
            </div>

            {/* Product Image */}
            <div className="flex justify-center items-center bg-gray-50 h-64 p-4">
              <div className="w-48 h-48 flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={product.image?.url || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description || "No description available"}
                </p>
              </div>
              <div className="mt-auto flex justify-between items-center">
                <p className="text-2xl font-extrabold text-green-700">
                  ₹ {product.price}
                </p>
                {product.weight && (
                  <span className="text-sm text-gray-500">
                    {product.weight}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Category:{" "}
                <span className="font-semibold">
                  {product.category?.name || "N/A"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filter.length === 0 && (
        <p className="text-center text-gray-500 mt-6 text-lg">
          No approved products found.
        </p>
      )}
    </>
  );

  return (
    <section className="container mx-auto py-12 px-6 mt-20 min-h-screen">
      <h2 className="text-5xl font-extrabold text-center mb-12 text-gray-900">
        ✅ Approved Product List
      </h2>
      {loading ? <Loading /> : <ShowProducts />}
    </section>
  );
};

export default ProductListAdmin;
