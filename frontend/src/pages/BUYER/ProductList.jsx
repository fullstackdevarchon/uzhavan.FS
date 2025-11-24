import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../../redux/action";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import toast from "react-hot-toast";
import { FaShoppingCart, FaCreditCard, FaChevronDown } from "react-icons/fa";
import PageContainer from "../../components/PageContainer";

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

  // Add to cart
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

  // Navigate to product page
  const buyProduct = (id) => navigate(`/buyer-dashboard/product/${id}`);

  // Load products
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
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/categories/enabled");
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filterProduct = (catId) => {
    setCategory(catId);
    setDropdownOpen(false);

    if (catId === "All") setFilter(data);
    else setFilter(data.filter((item) => item.category?._id === catId));
  };

  // Skeleton Loader
  const Loading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="border rounded-2xl p-6 shadow-xl bg-white/20 backdrop-blur-xl min-h-[400px]"
        >
          <Skeleton height={220} />
          <Skeleton className="mt-4" count={3} />
        </div>
      ))}
    </div>
  );

  // Show Products
  const ShowProducts = () => (
    <>
      {/* Dropdown */}
      <div className="flex justify-start mb-8" ref={dropdownRef}>
        <div className="relative w-60">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-white/20 backdrop-blur-xl border border-white/40 
            rounded-lg shadow-lg pl-4 pr-10 py-3 text-left text-white font-semibold 
            flex justify-between items-center hover:bg-white/30 transition"
          >
            {category === "All"
              ? "All Categories"
              : categories.find((c) => c._id === category)?.name}
            <FaChevronDown className="text-white" />
          </button>

          {dropdownOpen && (
            <div className="absolute mt-1 w-full bg-white/90 backdrop-blur-xl 
            border border-gray-200 rounded-lg shadow-xl z-20 max-h-64 overflow-auto">
              <div
                onClick={() => filterProduct("All")}
                className="px-4 py-3 cursor-pointer hover:bg-gray-200 text-gray-800 font-medium"
              >
                All Categories
              </div>

              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => filterProduct(cat._id)}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-200 text-gray-800 font-medium"
                >
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
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
            className="rounded-2xl shadow-2xl bg-white/20 backdrop-blur-xl 
            hover:shadow-3xl hover:-translate-y-2 transition border border-white/40 
            overflow-hidden relative group"
          >
            {/* Hover Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 
            group-hover:opacity-100 transition-opacity duration-300 z-20">
              <button
                onClick={() => buyProduct(product._id)}
                className="p-3 bg-black/70 hover:bg-black text-white rounded-full shadow-lg"
              >
                <FaCreditCard />
              </button>

              <button
                onClick={() => addProduct(product)}
                className="p-3 bg-white/70 text-black border border-black 
                hover:bg-black hover:text-white rounded-full shadow-lg transition"
              >
                <FaShoppingCart />
              </button>
            </div>

            {/* Image */}
            <div className="w-full h-60 bg-gray-200/30 overflow-hidden">
              <img
                src={product.image?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-5 text-white">
              <h2 className="text-lg font-bold mb-2 line-clamp-2">{product.name}</h2>

              <p className="text-sm text-gray-100 mb-4 line-clamp-3">
                {product.description}
              </p>

              <p className="text-xl font-bold text-[#1b3c2b]">
                ₹ {product.price}
                {product.weight && (
                  <span className="text-sm text-[#1b3c2b] ml-2">{product.weight}</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <PageContainer>
      <div className="container mx-auto py-16 px-4 mt-20 min-h-screen">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-white drop-shadow-md">
          Available Products
        </h2>

        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </PageContainer>
  );
};

export default ProductList;
