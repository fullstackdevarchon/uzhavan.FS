import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaLocationArrow, FaHashtag, FaSave, FaEdit } from "react-icons/fa";

const Profile = () => {
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
      pincode: ""
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user profile
  const fetchProfile = async () => {
    if (!token) {
      toast.error("Please login to view profile");
      navigate("/login/buyer");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` }
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
            pincode: data.user.address?.pincode || ""
          }
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login/buyer");
      }
      toast.error(err.response?.data?.message || "Failed to load profile");
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

  // Validate form
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!formData.address.street.trim()) {
      toast.error("Please enter your street address");
      return false;
    }
    if (!formData.address.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!/^\d{6}$/.test(formData.address.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  // Save profile
  const saveProfile = async () => {
    if (!validateForm()) return false;

    try {
      setSaving(true);
      await axios.put(
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
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login/buyer");
      }
      toast.error(err.response?.data?.message || "Failed to update profile");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveProfile();
    if (success) {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <button
              onClick={toggleEdit}
              className="px-4 py-2 bg-white text-green-700 rounded-md hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <FaSave /> Cancel
                </>
              ) : (
                <>
                  <FaEdit /> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full p-2 border rounded-md bg-gray-100 text-gray-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="10-digit phone number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Street Address <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-gray-400" />
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="House/Flat no, Building, Area"
                  required
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <FaCity className="text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            {/* District */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <div className="flex items-center gap-3">
                <FaLocationArrow className="text-gray-400" />
                <input
                  type="text"
                  name="district"
                  value={formData.address.district}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <div className="flex items-center gap-3">
                <FaGlobe className="text-gray-400" />
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="flex items-center gap-3">
                <FaGlobe className="text-gray-400" />
                <input
                  type="text"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Pincode */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pincode <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <FaHashtag className="text-gray-400" />
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="6-digit pincode"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  required
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={toggleEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
