import express from "express";
import { 
  createProduct, 
  getAllProducts, 
  getProductsByCategory,
  updateProductStatus 
} from "../controllers/product.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Create product (seller only)
router.post("/create",
  isAuthenticated,
  authorizeRoles(["seller"]),
  singleUpload,
  createProduct
);

// Get products by category (public)
router.get("/category/:category", getProductsByCategory);

// Get all products (admin only)
router.get("/all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getAllProducts
);

// Update product status (admin only)
router.patch("/:id/status",
  isAuthenticated,
  authorizeRoles(["admin"]),
  updateProductStatus
);

export default router;