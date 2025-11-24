import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart, decQty } from "../../redux/action";
import PageContainer from "../../components/PageContainer";

const CartPage = () => {
  const cartItems = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Subtotal, shipping, total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const shipping = cartItems.length > 0 ? 30 : 0;
  const total = subtotal + shipping;

  // Handle checkout popup
  const handleCheckout = () => {
    setLoading(true);
    setShowSuccess(true);

    setTimeout(() => {
      setLoading(false);
      setShowSuccess(false);
      navigate("/buyer-dashboard/Checkout");
    }, 2500);
  };

  return (
    <PageContainer>
      <div className="pt-20 px-4 max-w-6xl mx-auto relative">

        {/* SUCCESS POPUP */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[999] animate-fadeIn">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-xl w-[90%] max-w-sm animate-scaleIn">
              <div className="text-5xl animate-bounce mb-4">🚚</div>

              <h2 className="text-3xl font-bold text-white mb-2">
                Processing Order...
              </h2>

              <p className="text-[#C7DAD1] text-sm">
                Please wait while we confirm your purchase.
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-center text-5xl font-extrabold text-white drop-shadow mb-6">
          My Cart
        </h1>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-4xl font-bold text-white drop-shadow mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-[#C7DAD1] mb-6">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/buyer-dashboard/products"
              className="
                px-8 py-3 
                text-white 
                rounded-xl 
                shadow 
                border border-white/30 
                bg-[linear-gradient(to_right,#182E6F,rgba(27,60,43,0.6))]
                hover:bg-[linear-gradient(to_right,#1B3C2B,#182E6F)]
                transition
              "
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">

            {/* Cart Items */}
            <div className="md:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6">
                Shopping Cart
              </h2>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-6 pb-6 border-b border-white/10"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 object-contain bg-white/20 rounded-xl border border-white/20 p-2 shadow"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white drop-shadow">
                        {item.name}
                      </h3>

                      {item.weight && (
                        <p className="text-sm text-[#C7DAD1]">
                          Weight: {item.weight}
                        </p>
                      )}

                      <p className="text-[#C7DAD1] text-sm">
                        ₹{item.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center mt-4">
                        <button
                          onClick={() => dispatch(decQty(item))}
                          className="
                            px-3 py-1 text-white 
                            bg-white/20 border border-white/30 
                            rounded-l-md hover:bg-white/30 transition
                          "
                        >
                          <FaMinus />
                        </button>

                        <span className="px-4 py-1 bg-white/10 text-white border border-white/20">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => dispatch(addCart(item))}
                          className="
                            px-3 py-1 text-white 
                            bg-white/20 border border-white/30 
                            rounded-r-md hover:bg-white/30 transition
                          "
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-xl font-bold text-white">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </div>

                      <button
                        onClick={() => dispatch(delCart(item))}
                        className="text-red-400 hover:text-red-200 text-lg transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl h-max">
              <h2 className="text-3xl font-bold text-white mb-6">
                Order Summary
              </h2>

              <ul className="space-y-4 text-[#C7DAD1] text-lg">
                <li className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </li>

                <li className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </li>

                <li className="flex justify-between border-t border-white/20 pt-4 text-2xl font-bold text-white">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </li>
              </ul>

              {/* LOADING BUTTON */}
              <button
                onClick={loading ? null : handleCheckout}
                disabled={loading}
                className="
                  mt-6 block w-full text-center
                  text-white font-semibold py-3 rounded-xl shadow
                  bg-[linear-gradient(to_right,#182E6F,rgba(27,60,43,0.6))]
                  hover:bg-[linear-gradient(to_right,#1B3C2B,#182E6F)]
                  transition flex items-center justify-center gap-2
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="white"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CartPage;
