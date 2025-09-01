import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// ✅ Import Navbar & Footer
import { Navbar, Footer } from "../components";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);

  // Loading state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600); // simulate delay
    return () => clearTimeout(timer);
  }, []);

  // Empty cart UI
  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h4 className="text-3xl font-semibold text-gray-700 mb-6">
        No items in Cart
      </h4>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
      >
        <i className="fa fa-arrow-left mr-2"></i> Continue Shopping
      </Link>
    </div>
  );

  // Checkout form UI
  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    state.forEach((item) => {
      subtotal += item.price * item.qty;
      totalItems += item.qty;
    });

    return (
      
      <section className="min-h-[70vh] bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 h-fit">
            <h5 className="text-2xl font-bold mb-6 text-gray-800">
              Order Summary
            </h5>
            <ul className="space-y-4 text-gray-700">
              <li className="flex justify-between">
                <span>Products ({totalItems})</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </li>
              <li className="flex justify-between font-bold text-gray-900 text-lg border-t pt-4">
                <span>Total</span>
                <span>₹{(subtotal + shipping).toFixed(2)}</span>
              </li>
            </ul>
          </div>

          {/* Billing + Payment */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
            <h4 className="text-2xl font-bold mb-6 text-gray-800">
              Billing Address
            </h4>
            <form className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="1234 Main St"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Address 2 (Optional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Apartment or suite"
                />
              </div>

              {/* Country / State / Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Country
                  </label>
                  <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="">Choose...</option>
                    <option>India</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    State
                  </label>
                  <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="">Choose...</option>
                    <option>Punjab</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Zip
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <hr className="my-6" />

              {/* Payment */}
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Payment</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Full name as displayed on card"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Expiration
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-indigo-700 transition mt-6"
              >
                Continue to Checkout
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* ✅ Navbar at top */}
      <Navbar />

      <div className="container my-3 py-3">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-6">
          Checkout
        </h1>
        <hr className="mb-8" />

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : state.length ? (
          <ShowCheckout />
        ) : (
          <EmptyCart />
        )}
      </div>

      {/* ✅ Footer at bottom */}
      <Footer />
    </>
  );
};

export default Checkout;
