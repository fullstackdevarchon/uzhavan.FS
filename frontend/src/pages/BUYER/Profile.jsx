// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCity,
  FaGlobe,
  FaLocationArrow,
  FaHashtag,
} from "react-icons/fa";

const Profile = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    },
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        fullName: data.fullName || "",
        email: data.email || "",
        address: {
          street: data.address?.street || "",
          city: data.address?.city || "",
          district: data.address?.district || "",
          state: data.address?.state || "",
          country: data.address?.country || "",
          pincode: data.address?.pincode || "",
        },
        phone: data.phone || "",
      });

      setProfile(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle nested address change
  const handleAddressChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  // Validate phone & pincode
  const validateForm = () => {
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }
    if (!/^\d{6}$/.test(form.address.pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return false;
    }
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/profile/",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(data.message || "Profile updated successfully");
      fetchProfile(); // Refresh profile data after update
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-8 bg-gradient-to-r from-blue-50 to-blue-100 border rounded-2xl shadow-lg">
      <h2 className="text-4xl font-bold mb-10 text-center text-blue-700">
        My Profile
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Update Form */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-blue-600 flex items-center gap-2">
            <FaUser /> Update Profile
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Street */}
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-500" />
              <input
                type="text"
                placeholder="Street Address"
                value={form.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            {/* City */}
            <div className="flex items-center gap-3">
              <FaCity className="text-blue-500" />
              <input
                type="text"
                placeholder="City"
                value={form.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            {/* District */}
            <div className="flex items-center gap-3">
              <FaLocationArrow className="text-blue-500" />
              <input
                type="text"
                placeholder="District"
                value={form.address.district}
                onChange={(e) =>
                  handleAddressChange("district", e.target.value)
                }
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            {/* State */}
            <div className="flex items-center gap-3">
              <FaGlobe className="text-blue-500" />
              <input
                type="text"
                placeholder="State"
                value={form.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Country */}
            <div className="flex items-center gap-3">
              <FaGlobe className="text-blue-500" />
              <input
                type="text"
                placeholder="Country"
                value={form.address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Pincode */}
            <div className="flex items-center gap-3">
              <FaHashtag className="text-blue-500" />
              <input
                type="text"
                placeholder="Pincode (6 digits)"
                value={form.address.pincode}
                onChange={(e) => handleAddressChange("pincode", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                maxLength="6"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-500" />
              <input
                type="text"
                placeholder="Mobile Number (10 digits)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                maxLength="10"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Right: Display Current Profile */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-green-600 flex items-center gap-2">
            <FaEnvelope /> Current Profile
          </h3>
          {profile ? (
            <div className="overflow-hidden rounded-2xl shadow-xl bg-white">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6">
                <h4 className="text-2xl font-bold flex items-center gap-3">
                  <FaUser /> {profile.fullName}
                </h4>
                <p className="flex items-center gap-2 mt-1 text-blue-100">
                  <FaEnvelope /> {profile.email}
                </p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-gray-700 text-lg">
                <p className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span>
                    <strong>Street:</strong>{" "}
                    <span className="font-medium">
                      {profile.address?.street || "-"}
                    </span>
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <FaCity className="text-blue-500" />
                  <span>
                    <strong>City:</strong>{" "}
                    <span className="font-medium">
                      {profile.address?.city || "-"}
                    </span>
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <FaLocationArrow className="text-blue-500" />
                  <span>
                    <strong>District:</strong>{" "}
                    <span className="font-medium">
                      {profile.address?.district || "-"}
                    </span>
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <FaGlobe className="text-blue-500" />
                  <span>
                    <strong>State:</strong>{" "}
                    <span className="font-medium">
                      {profile.address?.state || "-"}
                    </span>
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <FaGlobe className="text-blue-500" />
                  <span>
                    <strong>Country:</strong>{" "}
                    <span className="font-medium">
                      {profile.address?.country || "-"}
                    </span>
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <FaHashtag className="text-blue-500" />
                  <span>
                    <strong>Pincode:</strong>{" "}
                    <span className="font-medium">
                      {profile.address?.pincode || "-"}
                    </span>
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <FaPhoneAlt className="text-blue-500" />
                  <span>
                    <strong>Mobile:</strong>{" "}
                    <span className="font-medium">
                      {profile.phone || "-"}
                    </span>
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Loading current profile...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
