import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart, decQty } from "../../redux/action";
import PageContainer from "../../components/PageContainer";

const CartPage = () => {
  const cartItems = useSelector((state) => state.handleCart); // reducer name: handleCart
  const dispatch = useDispatch();

  // Subtotal, shipping, total
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cartItems.length > 0 ? 30 : 0;
  const total = subtotal + shipping;

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          My Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">
              Your Cart is Empty
            </h2>
            <Link
              to="/buyer-dashboard/products"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
                >
                  {/* Product Info */}
                  <div className="flex items-center space-x-6">
                    {/* Product Image */}
                    {item.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      {item.weight && (
                        <p className="text-sm text-gray-500 mb-1">
                          Weight: {item.weight}
                        </p>
                      )}
                      <p className="text-gray-600">Price: ₹{item.price}</p>

                      {/* Quantity controls */}
                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() => dispatch(decQty(item))}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                          <FaMinus />
                        </button>
                        <span className="px-4 py-1 bg-gray-100 rounded">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => dispatch(addCart(item))}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price + Delete */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-lg font-bold text-gray-800">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                    <button
                      onClick={() => dispatch(delCart(item))}
                      className="text-red-600 hover:text-red-400 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 h-max">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </li>
                <li className="flex justify-between font-bold text-gray-900 text-lg border-t pt-4">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </li>
              </ul>
              <Link
                to="/buyer-dashboard/Checkout"
                className="mt-6 block w-full text-center bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CartPage;
