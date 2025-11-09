// routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getSellerProducts,
  updateProductStatus,
  deleteProduct,
  markAsSold,
  getBuyerProducts,
  getProductById,
  updateProductStock,       // ✅ new import
  getSimilarProducts,
} from "../controllers/product.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

/**
 * =========================
 * SELLER ROUTES
 * =========================
 */

// Seller: Create a product
router.post(
  "/create",
  isAuthenticated,
  authorizeRoles(["seller"]),
  singleUpload,
  createProduct
);

// Seller: Get all their own products
router.get(
  "/seller",
  isAuthenticated,
  authorizeRoles(["seller"]),
  getSellerProducts
);

// Seller: Update stock
router.put(
  "/:id",                     // Matches your frontend PUT request
  isAuthenticated,
  authorizeRoles(["seller"]),
  updateProductStock           // ✅ New controller
);

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

// Admin: Get all products
router.get(
  "/all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getAllProducts
);

// Admin: Update product status
router.patch(
  "/:id/status",
  isAuthenticated,
  authorizeRoles(["admin"]),
  updateProductStatus
);

// Admin & Seller: Delete product
router.delete("/:id", isAuthenticated, deleteProduct);

/**
 * =========================
 * PUBLIC / BUYER ROUTES
 */

// Public: Get products by category
router.get("/category/:category", getProductsByCategory);

// Public: Get all approved & available products (buyer view)
router.get("/buyer", getBuyerProducts);

// Public: Get single product by ID
router.get("/:id", getProductById);

// Buyer: Purchase a product (mark as sold / reduce quantity)
router.patch(
  "/:id/sold",
  isAuthenticated,
  authorizeRoles(["buyer"]),
  markAsSold
);

// Optional: Similar products by category
router.get("/similar/:categoryId/:productId", getSimilarProducts);

export default router;
