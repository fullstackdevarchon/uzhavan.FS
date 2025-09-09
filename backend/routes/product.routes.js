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
  getProductById,        // ✅ Add this import
  getSimilarProducts,    // Optional: for similar products feature
} from "../controllers/product.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

/**
 * =========================
 * SELLER ROUTES
 * =========================
 */

// Seller: Create a product (status = pending)
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

// Admin: Update product status (approved / rejected / pending)
router.patch(
  "/:id/status",
  isAuthenticated,
  authorizeRoles(["admin"]),
  updateProductStatus
);

// Admin & Seller: Delete product
// Admin can delete any product; Seller can delete only their own
router.delete("/:id", isAuthenticated, deleteProduct);

/**
 * =========================
 * PUBLIC / BUYER ROUTES
 * =========================
 */

// Public: Get products by category (approved, available)
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

// Optional: Similar products by category (excluding current product)
router.get("/similar/:categoryId/:productId", getSimilarProducts);

export default router;
