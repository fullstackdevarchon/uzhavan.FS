import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import BaseLayout from "./BaseLayout";

const AdminLayout = () => {
  return (
    <BaseLayout>
      {/* Navbar with glassmorphism */}
      <div className="sticky top-0 z-50">
        <AdminNavbar />
      </div>

      {/* Main content */}
      <div className="container mx-0 px-1 py-2">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <Outlet />
        </div>
      </div>
    </BaseLayout>
  );
};

export default AdminLayout;
