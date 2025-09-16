import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaTrashAlt,
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaClock,
} from "react-icons/fa";
import axios from "axios";

const LabourList = () => {
  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch labours from backend
  const fetchLabours = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/labours", {
        withCredentials: true,
      });
      setLabours(data.labours || []);
    } catch (error) {
      console.error("❌ Error fetching labours:", error);
      toast.error("Failed to fetch labours.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete labour from backend
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/labours/${id}`, {
        withCredentials: true,
      });
      setLabours(labours.filter((labour) => labour._id !== id));
      toast.success("Labour removed successfully!");
    } catch (error) {
      console.error("❌ Error deleting labour:", error);
      toast.error("Failed to delete labour.");
    }
  };

  useEffect(() => {
    fetchLabours();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Labour List
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : labours.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No labours found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {labours.map((labour, index) => (
            <div
              key={labour._id}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between hover:shadow-2xl transition duration-300 border border-gray-100"
            >
              {/* Labour Details */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaUser className="text-indigo-600" /> {labour.fullName}
                </h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" /> {labour.email}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaIdBadge className="text-green-500" /> Role: {labour.role}
                </p>
                <p className="text-gray-500 flex items-center gap-2 text-sm">
                  <FaClock className="text-gray-400" /> Joined:{" "}
                  {new Date(labour.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(labour._id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-200 shadow-md"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabourList;
