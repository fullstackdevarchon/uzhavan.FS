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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      country: "India",
      pincode: "",
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const token = localStorage.getItem("token");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? 30 : 0;
  const total = subtotal + shipping;

  // Fetch user profile
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("http://localhost:5000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (data.user) {
        setFormData({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: {
            street: data.user.address?.street || "",
            city: data.user.address?.city || "",
            district: data.user.address?.district || "",
            state: data.user.address?.state || "",
            country: data.user.address?.country || "India",
            pincode: data.user.address?.pincode || "",
          },
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Could not load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        "http://localhost:5000/api/profile/",
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!token) {
      toast.error("Please login to place an order");
      return navigate("/login/buyer");
    }

    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.address.street || 
        !formData.address.city || !formData.address.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setOrderLoading(true);
    try {
      // First, update profile if in edit mode
      if (isEditing) {
        await saveProfile();
      }

      // Prepare and validate products with MongoDB ObjectId
      const objectIdRegex = /^[a-fA-F0-9]{24}$/;
      const invalidItems = [];
      const normalizedProducts = cart.map((item) => {
        let pid = item?._id || item?.product?._id || item?.productId || item?.id;
        if (typeof pid === 'number') pid = String(pid);
        if (pid && typeof pid === 'object' && pid._id) pid = pid._id;
        const isValid = typeof pid === 'string' && objectIdRegex.test(pid);
        if (!isValid) {
          invalidItems.push(item.title || pid || 'Unknown');
        }
        return {
          product: pid,
          qty: Number(item.qty),
          price: Number(item.price)
        };
      });

      if (invalidItems.length > 0) {
        toast.error(`Some items cannot be ordered (invalid IDs): ${invalidItems.join(', ')}`);
        setOrderLoading(false);
        return;
      }

      // Align payload with backend expectations
      const orderData = {
        products: normalizedProducts,
        address: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          country: formData.address.country || 'India',
          zip: formData.address.pincode,
        },
        paymentMethod: 'Cash on Delivery',
        total: total,
      };

      // Send order request
      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      // Clear cart on successful order
      cart.forEach(item => dispatch(delCart(item)));
      
      // Redirect to order success page
      navigate(`/order/${data.order._id}/success`);
      toast.success("Order placed successfully!");
      
    } catch (err) {
      console.error("Order error:", err);
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Checkout</h2>
      <div className="row g-4">
        {/* Shipping Information */}
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Shipping Information</h5>
                {!isEditing && (
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={toggleEdit}
                    type="button"
                  >
                    <i className="bi bi-pencil me-1"></i> Edit
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="fullName" className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit phone number"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="street" className="form-label">
                      Street Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      name="street"
                      value={formData.address.street}
                      onChange={handleAddressChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="district" className="form-label">District</label>
                    <input
                      type="text"
                      className="form-control"
                      id="district"
                      name="district"
                      value={formData.address.district}
                      onChange={handleAddressChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">
                      State <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={formData.address.state}
                      onChange={handleAddressChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="pincode" className="form-label">
                      Pincode <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pincode"
                      name="pincode"
                      value={formData.address.pincode}
                      onChange={handleAddressChange}
                      disabled={!isEditing}
                      pattern="[0-9]{6}"
                      title="Please enter a valid 6-digit pincode"
                      required
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="col-12 d-flex justify-content-end gap-2 pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfile(); // Reset form
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={saveProfile}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Items</h5>
            </div>
            <div className="card-body p-0">
              {cart.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted">Your cart is empty</p>
                  <Link to="/products" className="btn btn-primary">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {cart.map((item) => (
                    <div key={item.id} className="list-group-item">
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="rounded me-3" 
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.title}</h6>
                          <p className="mb-1 text-muted">Qty: {item.qty}</p>
                          <p className="mb-0 fw-bold">₹{(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.qty, 0)} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h5>Total</h5>
                <h5 className="text-primary">₹{total.toFixed(2)}</h5>
              </div>
              
              <button
                className="btn btn-success w-100 py-2 mb-3"
                onClick={handlePlaceOrder}
                disabled={orderLoading || cart.length === 0}
              >
                {orderLoading ? 'Processing...' : 'Place Order'}
              </button>
              
              <p className="small text-muted text-center mb-0">
                By placing your order, you agree to our{' '}
                <Link to="/terms" className="text-primary">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="text-primary">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
