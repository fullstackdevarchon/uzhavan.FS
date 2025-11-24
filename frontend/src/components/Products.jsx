import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaShoppingCart, FaCreditCard, FaChevronDown } from "react-icons/fa";

import productsData from "../data/products.json";

const ProductList = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart!");
  };

  // Load products
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(productsData);
      setFilter(productsData);
      setLoading(false);
    }, 500);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterProduct = (cat) => {
    setCategory(cat);
    setDropdownOpen(false);
    if (cat === "All") {
      setFilter(data);
    } else {
      setFilter(
        data.filter(
          (item) => item.category.toLowerCase() === cat.toLowerCase()
        )
      );
    }
  };

  // Skeleton loader
  const Loading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="border rounded-xl p-6 shadow-lg bg-white/40 backdrop-blur-xl min-h-[400px]"
        >
          <Skeleton height={220} />
          <Skeleton className="mt-4" count={3} />
        </div>
      ))}
    </div>
  );

  // Render products
  const ShowProducts = () => (
    <>
      {/* Dropdown Filter */}
      <div className="flex justify-start mb-8" ref={dropdownRef}>
        <div className="relative w-60">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full bg-white/20 backdrop-blur-xl border border-white/40 
            rounded-lg shadow-md pl-4 pr-10 py-3 text-left text-white font-semibold 
            flex justify-between items-center hover:bg-white/30 transition-all"
          >
            {category === "All"
              ? "All Categories"
              : category.charAt(0).toUpperCase() + category.slice(1)}
            <FaChevronDown className="ml-2 text-white" />
          </button>

          {dropdownOpen && (
            <div className="absolute mt-1 w-full bg-white/80 backdrop-blur-xl
            border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-auto">
              {["All", "spices", "fruits", "vegetables"].map((catOption) => (
                <div
                  key={catOption}
                  onClick={() => filterProduct(catOption)}
                  className="cursor-pointer px-4 py-3 hover:bg-gray-200 transition text-gray-800 font-medium"
                >
                  {catOption === "All"
                    ? "All Categories"
                    : catOption.charAt(0).toUpperCase() + catOption.slice(1)}
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
            key={product.id}
            className="rounded-2xl shadow-xl bg-white/20 backdrop-blur-xl 
            hover:shadow-3xl hover:-translate-y-2 transition-all border border-white/40 
            overflow-hidden relative group"
          >
            {/* Hover Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 
            group-hover:opacity-100 transition-opacity duration-300 z-20">
              <Link
                to={`/product/${product.id}`}
                className="p-3 bg-black/70 hover:bg-black text-white rounded-full shadow-md"
              >
                <FaCreditCard />
              </Link>

              <button
                onClick={() => addProduct(product)}
                className="p-3 bg-white/70 text-black border border-black 
                hover:bg-black hover:text-white rounded-full shadow-md transition"
              >
                <FaShoppingCart />
              </button>
            </div>

            {/* ✅ UPDATED IMAGE → SAME SIZE FOR ALL, NO HOVER ZOOM */}
            <div className="w-full h-60 bg-gray-200/20 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-5 text-white">
              <h2 className="text-lg font-bold mb-2 line-clamp-2">
                {product.title}
              </h2>
              <p className="text-sm text-gray-100 mb-4 line-clamp-3">
                {product.description}
              </p>

              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-[#1b3c2b]">
                  ₹ {product.price}{" "}
                  <span className="text-xl font-bold text-[ #1b3c2b]">
                    ({product.weight})
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section className="container mx-auto py-16 px-4 mt-20 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-white tracking-wide drop-shadow-lg">
        Latest Products
      </h2>
      {loading ? <Loading /> : <ShowProducts />}
    </section>
  );
};

export default ProductList;
