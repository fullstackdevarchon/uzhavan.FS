import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Pages
import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  PageNotFound,
} from "./pages";

// Buyer Nested Pages
import ProductList from "./pages/BUYER/ProductList";
import OrderList from "./pages/BUYER/OrderList";
import CartPage from "./pages/BUYER/CartPage";
import Checkout from "./pages/BUYER/Checkout";
import BuyerProduct from "./pages/BUYER/Product";
import BuyerNavbar from "./pages/BUYER/Buyernavber";

// Seller Dashboard + Navbar
import SellerNavbar from "./pages/Seller/selernavbar";
import AddProduct from "./pages/Seller/AddProduct";
import CheckStatus from "./pages/Seller/CheckStatus";
import MyProducts from "./pages/Seller/MyProducts";  // ✅ New Import

// Admin Dashboard + Navbar
import AdminNavbar from "./pages/Admin/AdminNavbar";
import ProductListAdmin from "./pages/Admin/ProductList"; 
import SellerRequests from "./pages/Admin/SellerRequests"; 
import Analytics from "./pages/Admin/Analytics"; 
import Inventory from "./pages/Admin/Inventory"; 
import Orders from "./pages/Admin/Orders"; 

// Utilities
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* Scroll to top on route change */}
      <ScrollToTop />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Buyer Dashboard with Nested Routes */}
        <Route path="/buyer-dashboard" element={<BuyerNavbar />}>
          <Route index element={<ProductList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<BuyerProduct />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* Seller Dashboard with Nested Routes */}
        <Route path="/seller-dashboard" element={<SellerNavbar />}>
          <Route index element={<AddProduct />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="my-products" element={<MyProducts />} /> {/* ✅ Added */}
          <Route path="check-status" element={<CheckStatus />} />
        </Route>

        {/* Admin Dashboard with Nested Routes */}
        <Route path="/admin-dashboard" element={<AdminNavbar />}>
          <Route index element={<ProductListAdmin />} />
          <Route path="product-list" element={<ProductListAdmin />} />
          <Route path="seller-requests" element={<SellerRequests />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* Error Handling */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* Global Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
