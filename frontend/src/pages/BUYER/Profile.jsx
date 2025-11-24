import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaLocationArrow,
  FaHashtag,
  FaSave,
  FaEdit,
} from "react-icons/fa";
import PageContainer from "../../components/PageContainer";

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
      country: "INDIA",
      pincode: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    if (!token) {
      toast.error("PLEASE LOGIN TO VIEW PROFILE");
      navigate("/login/buyer");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.user) {
        setFormData({
          fullName: data.user.fullName?.toUpperCase() || "",
          email: data.user.email?.toUpperCase() || "",
          phone: data.user.phone || "",
          address: {
            street: data.user.address?.street?.toUpperCase() || "",
            city: data.user.address?.city?.toUpperCase() || "",
            district: data.user.address?.district?.toUpperCase() || "",
            state: data.user.address?.state?.toUpperCase() || "",
            country: data.user.address?.country?.toUpperCase() || "INDIA",
            pincode: data.user.address?.pincode || "",
          },
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login/buyer");
      }
      toast.error(err.response?.data?.message || "FAILED TO LOAD PROFILE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Simple field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  // Nested address field change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value.toUpperCase(),
      },
    }));
  };

  // Validation
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("ENTER FULL NAME");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("ENTER VALID 10 DIGIT PHONE");
      return false;
    }
    if (!formData.address.city.trim()) {
      toast.error("ENTER CITY");
      return false;
    }
    if (!/^\d{6}$/.test(formData.address.pincode)) {
      toast.error("ENTER VALID 6 DIGIT PINCODE");
      return false;
    }
    return true;
  };

  const saveProfile = async () => {
    if (!validateForm()) return false;

    try {
      setSaving(true);
      await axios.put("http://localhost:5000/api/profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("PROFILE UPDATED SUCCESSFULLY");
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login/buyer");
      }
      toast.error(err.response?.data?.message || "FAILED TO UPDATE PROFILE");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await saveProfile();
    if (ok) setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="min-h-screen px-4 py-10">

        {/* CARD */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 md:p-10 shadow-2xl">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-center pb-5 border-b border-white/20 gap-4">
            <h1 className="text-3xl font-bold text-white tracking-widest text-center sm:text-left">
              MY PROFILE
            </h1>

            <button
              onClick={toggleEdit}
              className="px-6 py-2 bg-white/20 text-white font-bold rounded-lg border border-white/30 hover:bg-white/30 transition flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {isEditing ? <><FaSave /> CANCEL</> : <><FaEdit /> EDIT PROFILE</>}
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6"
          >
            <InputField
              label="FULL NAME"
              icon={<FaUser />}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <InputField
              label="EMAIL"
              icon={<FaEnvelope />}
              name="email"
              value={formData.email}
              disabled
            />

            <InputField
              label="PHONE"
              icon={<FaPhone />}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <InputField
              label="STREET"
              icon={<FaMapMarkerAlt />}
              name="street"
              value={formData.address.street}
              onChange={handleAddressChange}
              disabled={!isEditing}
              required
              full
            />

            <InputField
              label="CITY"
              icon={<FaCity />}
              name="city"
              value={formData.address.city}
              onChange={handleAddressChange}
              disabled={!isEditing}
              required
            />

            <InputField
              label="DISTRICT"
              icon={<FaLocationArrow />}
              name="district"
              value={formData.address.district}
              onChange={handleAddressChange}
              disabled={!isEditing}
            />

            <InputField
              label="STATE"
              icon={<FaGlobe />}
              name="state"
              value={formData.address.state}
              onChange={handleAddressChange}
              disabled={!isEditing}
            />

            <InputField
              label="COUNTRY"
              icon={<FaGlobe />}
              name="country"
              value={formData.address.country}
              onChange={handleAddressChange}
              disabled={!isEditing}
            />

            <InputField
              label="PINCODE"
              icon={<FaHashtag />}
              name="pincode"
              value={formData.address.pincode}
              onChange={handleAddressChange}
              disabled={!isEditing}
              required
            />

            {/* SAVE BUTTON */}
            {isEditing && (
              <div className="col-span-1 sm:col-span-2 flex justify-center sm:justify-end pt-6 border-t border-white/20">
                <button
                  type="submit"
                  className="px-8 py-3 bg-white/20 text-white font-bold rounded-lg border border-white/30 hover:bg-white/30 transition flex items-center gap-2 w-full sm:w-auto justify-center"
                  disabled={saving}
                >
                  {saving ? "SAVING..." : <><FaSave /> SAVE</>}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

// INPUT COMPONENT
const InputField = ({
  label,
  icon,
  name,
  value,
  onChange,
  disabled,
  required,
  full,
}) => (
  <div className={`${full ? "sm:col-span-2" : ""}`}>
    <label className="block text-white text-sm font-bold mb-1 tracking-wider">
      {label} {required && "*"}
    </label>

    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 sm:p-4 shadow-xl">
      <span className="text-white text-lg">{icon}</span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-transparent text-white uppercase outline-none disabled:opacity-50 text-sm sm:text-base"
      />
    </div>
  </div>
);

export default Profile;
