import React from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const PageNotFound = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") && localStorage.getItem("role") === "admin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6">
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <ExclamationTriangleIcon className="w-20 h-20 text-red-500 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </p>

        {/* Message */}
        <p className="mt-4 text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate(isAuthenticated ? '/admin-dashboard' : '/login/admin')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to {isAuthenticated ? 'Dashboard' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
