import React from "react";
import { Navbar, Footer } from "../components";

const BuyerDashboard = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-10 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">Buyer Dashboard</h1>
          <p className="text-gray-600">Welcome, valued Buyer! 🎉</p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BuyerDashboard;
