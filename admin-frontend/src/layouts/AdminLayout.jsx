import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AdminLayout = ({ user, setAuthState }) => {
  const navigate = useNavigate();

  // Redirect if unauthorized
  if (!user || user.role !== "admin") {
    toast.error("Unauthorized access");
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>

            <div className="flex items-center space-x-4">
              <span>{user.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-white shadow-inner p-4 space-y-2">
          <a
            href="/admin-dashboard/product-list"
            className="block px-3 py-2 rounded hover:bg-indigo-100"
          >
            Product List
          </a>
          <a
            href="/admin-dashboard/seller-requests"
            className="block px-3 py-2 rounded hover:bg-indigo-100"
          >
            Seller Requests
          </a>
          <a
            href="/admin-dashboard/analytics"
            className="block px-3 py-2 rounded hover:bg-indigo-100"
          >
            Analytics
          </a>
          <a
            href="/admin-dashboard/orders"
            className="block px-3 py-2 rounded hover:bg-indigo-100"
          >
            Orders
          </a>
          <a
            href="/admin-dashboard/categories"
            className="block px-3 py-2 rounded hover:bg-indigo-100"
          >
            Categories
          </a>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
