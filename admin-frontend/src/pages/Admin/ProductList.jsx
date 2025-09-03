import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { FaTrash, FaChevronDown } from "react-icons/fa";

// ✅ Import local JSON file directly
import productsData from "../../data/products.json";

const ProductListAdmin = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

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

  // ✅ Delete product with confirmation
  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);

      // Keep filter in sync with updated data
      if (category === "All") {
        setFilter(updatedData);
      } else {
        setFilter(
          updatedData.filter(
            (item) => item.category.toLowerCase() === category.toLowerCase()
          )
        );
      }
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
            {/* Hover Delete button */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => deleteProduct(product.id)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg flex items-center justify-center"
              >
                <FaTrash />
              </button>
            </div>

            {/* Product image */}
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
              <div className="mt-auto flex justify-between items-center">
                <p className="text-xl font-bold">₹ {product.price}</p>
                {product.weight && (
                  <span className="text-sm text-gray-500">
                    {product.weight}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section className="container mx-auto py-12 px-4 mt-20 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8">
        Admin Product List
      </h2>
      {loading ? <Loading /> : <ShowProducts />}
    </section>
  );
};

export default ProductListAdmin;
