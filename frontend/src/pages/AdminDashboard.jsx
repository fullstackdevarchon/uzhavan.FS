import React from "react";
import { Navbar, Footer } from "../components";

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-10 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, mighty Admin! 👑</p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;
