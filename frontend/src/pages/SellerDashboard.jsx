import React from "react";
import { Navbar, Footer } from "../components";

const SellerDashboard = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-10 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-green-700 mb-4">Seller Dashboard</h1>
          <p className="text-gray-600">Welcome, trusted Seller! 🛒</p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SellerDashboard;
