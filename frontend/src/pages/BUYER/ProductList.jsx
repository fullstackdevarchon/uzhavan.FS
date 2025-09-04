import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../../redux/action";
import { Link } from "react-router-dom";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import toast from "react-hot-toast";
import { FaShoppingCart, FaCreditCard, FaChevronDown } from "react-icons/fa";

// ✅ Import local JSON file directly
import productsData from "../../data/products.json";

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

  // Load products from local JSON
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(productsData);
      setFilter(productsData);
      setLoading(false);
    }, 500);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="border rounded-lg p-6 shadow-lg bg-white min-h-[400px]"
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
      {/* Dropdown filter */}
      <div className="flex justify-start mb-6" ref={dropdownRef}>
        <div className="relative w-52">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 py-2 text-left text-gray-700 font-medium hover:border-gray-800 flex justify-between items-center"
          >
            {category === "All"
              ? "All Categories"
              : category.charAt(0).toUpperCase() + category.slice(1)}
            <FaChevronDown className="ml-2 text-gray-500" />
          </button>
          {dropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
              {["All", "spices", "fruits", "vegetables"].map((catOption) => (
                <div
                  key={catOption}
                  onClick={() => filterProduct(catOption)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition"
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

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filter.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md hover:shadow-2xl transition overflow-hidden relative flex flex-col h-full group"
          >
            {/* Hover icons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                to={`/buyer-dashboard/product/${product.id}`}  
                className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 shadow-lg flex items-center justify-center"
              >
                <FaCreditCard />
              </Link>
              <button
                onClick={() => addProduct(product)}
                className="p-2 bg-white border border-gray-800 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white shadow-lg flex items-center justify-center"
              >
                <FaShoppingCart />
              </button>
            </div>

            {/* Product image - ✅ square equal size */}
            <div className="flex justify-center items-center bg-gray-50 h-64 p-4">
              <div className="w-48 h-48 flex items-center justify-center overflow-hidden rounded-md">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Product info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>
              </div>
              <div className="mt-auto">
                <p className="text-xl font-bold">₹ {product.price}</p>
                {product.weight && (
                  <p className="text-sm text-gray-500 mt-1">
                    {product.weight}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8">Latest Products</h2>
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default ProductList;
