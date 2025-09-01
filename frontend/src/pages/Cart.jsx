import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  // Loading state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // fake delay
    return () => clearTimeout(timer);
  }, []);

  const addItem = (product) => {
    dispatch(addCart(product));
  };

  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h4 className="text-3xl font-semibold text-gray-700 mb-6">
        Your Cart is Empty
      </h4>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
      >
        <i className="fa fa-arrow-left mr-2"></i> Continue Shopping
      </Link>
    </div>
  );

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    state.forEach((item) => {
      subtotal += item.price * item.qty;
      totalItems += item.qty;
    });

    return (
      <section className="min-h-[70vh] bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 bg-white shadow-lg rounded-xl p-6">
              <h5 className="text-2xl font-bold mb-6 text-gray-800">
                Shopping Cart
              </h5>
              {state.map((item) => (
                <div key={item.id} className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center space-x-6">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-contain rounded-lg border"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h6 className="font-semibold text-lg text-gray-800">
                        {item.title}
                      </h6>
                      <p className="text-gray-500">
                        ₹{item.price.toFixed(2)} each
                      </p>
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() => removeItem(item)}
                          className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300 transition"
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="px-4 py-1 bg-gray-100">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => addItem(item)}
                          className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300 transition"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-lg font-bold text-gray-800">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-lg rounded-xl p-6">
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
              <Link
                to="/checkout"
                className="mt-6 block w-full text-center bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Go to Checkout
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-6">
          Cart
        </h1>
        <hr className="mb-8" />

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : state.length > 0 ? (
          <ShowCart />
        ) : (
          <EmptyCart />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
