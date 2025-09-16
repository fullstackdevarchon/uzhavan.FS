// src/pages/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { delCart } from "../../redux/action";

const Checkout = () => {
  const cart = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    zip: "",
  });
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? 30 : 0;
  const total = subtotal + shipping;

  const token = localStorage.getItem("token");

  // ✅ Fetch user profile to auto-fill address
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("http://localhost:5000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && data.user) {
        const user = data.user;
        setAddress({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          country: user.address?.country || "India",
          zip: user.address?.pincode || "",
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Could not load user profile");
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // ✅ Handle place order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login as Buyer to place order");
      return navigate("/login");
    }

    setLoading(true);
    try {
      const orderData = {
        products: cart.map((item) => ({
          product: item.id || item._id, // handle both
          qty: item.qty,
          price: item.price,
        })),
        address,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/v1/orders/create",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("✅ Order Placed (Cash on Delivery)");
        cart.forEach((item) => dispatch(delCart(item)));
        navigate("/buyer-dashboard/orders");
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("❌ Order error:", err);
      toast.error(
        err.response?.data?.message || "Order failed. Please login as Buyer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Checkout
        </h1>

        {cart.length === 0 ? (
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
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Address Form */}
            <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6 space-y-4">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">
                Billing Address
              </h4>

              <input
                type="text"
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={address.email}
                onChange={(e) =>
                  setAddress({ ...address, email: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={address.phone}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="text"
                placeholder="Street"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Zip"
                  value={address.zip}
                  onChange={(e) =>
                    setAddress({ ...address, zip: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
              <select
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="India">India</option>
              </select>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-lg rounded-xl p-6 h-fit">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Product List */}
              <ul className="divide-y divide-gray-200 mb-6">
                {cart.map((item, index) => (
                  <li key={index} className="flex justify-between py-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.qty} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </li>
                <li className="flex justify-between font-bold text-lg border-t pt-4">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </li>
              </ul>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition"
              >
                {loading ? "Placing Order..." : "Place Order (Cash on Delivery)"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
