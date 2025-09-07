import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getSellerProducts,
  updateProductStatus,
  deleteProduct, // ✅ shared controller
} from "../controllers/product.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Seller: create product (pending by default)
router.post(
  "/create",
  isAuthenticated,
  authorizeRoles(["seller"]),
  singleUpload,
  createProduct
);

// Seller: get own products
router.get(
  "/seller",
  isAuthenticated,
  authorizeRoles(["seller"]),
  getSellerProducts
);

// Public: get products by category
router.get("/category/:category", getProductsByCategory);

// Admin: get all products
router.get(
  "/all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getAllProducts
);

// Admin: update product status
router.patch(
  "/:id/status",
  isAuthenticated,
  authorizeRoles(["admin"]),
  updateProductStatus
);

// ✅ Delete product (Admin → any product, Seller → only their own)
router.delete("/:id", isAuthenticated, deleteProduct);

export default router;
