import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AddLabour = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "labour", // always labour by default
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/labours/add",
        formData,
        {
          withCredentials: true, // ✅ send cookies if JWT stored in cookie
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ also send token if stored in localStorage
          },
        }
      );

      if (res.data.success) {
        toast.success("Labour added successfully!");
        setFormData({ fullName: "", email: "", password: "", role: "labour" });
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Add Labour Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to add labour. Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        Add Labour
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            placeholder="Enter full name"
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter email"
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Enter password"
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-md`}
        >
          {loading ? "Adding..." : "Add Labour"}
        </button>
      </form>
    </div>
  );
};

export default AddLabour;
