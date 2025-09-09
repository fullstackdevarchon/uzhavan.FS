import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../../redux/action";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import toast from "react-hot-toast";
import { FaShoppingCart, FaCreditCard, FaChevronDown } from "react-icons/fa";

const ProductList = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ✅ Add to cart
  const addProduct = (product) => {
    const productDetails = {
      id: product._id,
      name: product.name,
      price: product.price,
      weight: product.weight || "",
      image: product.image?.url || "",
      description: product.description,
      qty: 1,
    };
    dispatch(addCart(productDetails));
    toast.success(`${product.name} added to cart!`);
  };

  // ✅ Navigate to product page
  const buyProduct = (id) => {
    navigate(`/buyer-dashboard/product/${id}`);
  };

  // ✅ Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/v1/products/buyer");
        if (res.data.success) {
          setData(res.data.products);
          setFilter(res.data.products);
        }
      } catch (error) {
        console.error("❌ Error fetching buyer products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/categories/enabled");
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterProduct = (catId) => {
    setCategory(catId);
    setDropdownOpen(false);
    if (catId === "All") {
      setFilter(data);
    } else {
      setFilter(data.filter((item) => item.category?._id === catId));
    }
  };

  // Skeleton UI
  const Loading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="border rounded-lg p-6 shadow-lg bg-white min-h-[400px]">
          <Skeleton height={220} />
          <Skeleton className="mt-4" count={3} />
        </div>
      ))}
    </div>
  );

  // Show products
  const ShowProducts = () => (
    <>
      {/* Dropdown filter */}
      <div className="flex justify-start mb-6" ref={dropdownRef}>
        <div className="relative w-52">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 py-2 text-left text-gray-700 font-medium hover:border-gray-800 flex justify-between items-center"
          >
            {category === "All"
              ? "All Categories"
              : categories.find((c) => c._id === category)?.name || "Category"}
            <FaChevronDown className="ml-2 text-gray-500" />
          </button>
          {dropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
              <div
                key="All"
                onClick={() => filterProduct("All")}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition"
              >
                All Categories
              </div>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => filterProduct(cat._id)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition"
                >
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product grid */}
      {filter.length === 0 ? (
        <p className="text-center text-gray-500 text-lg col-span-full">
          No products available in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filter.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition overflow-hidden relative flex flex-col h-full group"
            >
              {/* Hover icons */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => buyProduct(product._id)}
                  className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg flex items-center justify-center"
                >
                  <FaCreditCard />
                </button>
                <button
                  onClick={() => addProduct(product)}
                  className="p-2 bg-white border border-gray-800 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white shadow-lg flex items-center justify-center"
                >
                  <FaShoppingCart />
                </button>
              </div>

              {/* Product image */}
              <div className="flex justify-center items-center bg-gray-50 h-64 p-4">
                <div className="w-48 h-48 flex items-center justify-center overflow-hidden rounded-md">
                  <img
                    src={product.image?.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Product info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>
                </div>
                <div className="mt-auto">
                  <p className="text-xl font-bold">₹ {product.price}</p>
                  {product.weight && (
                    <p className="text-sm text-gray-500 mt-1">{product.weight}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8">Available Products</h2>
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default ProductList;
