import React from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { ExclamationTriangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const PageNotFound = () => {
  return (
    <PageContainer>
      <div className="flex items-center justify-center">
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
          <p className="mt-2 text-gray-600">
            Sorry, the page you’re looking for doesn’t exist.
          </p>

          {/* Back to Home Button */}
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PageNotFound;
