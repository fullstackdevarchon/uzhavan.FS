import express from "express";
import {
  getAllCategories,
  getEnabledCategories,
  toggleCategory,
  updateCategoryLimit,
} from "../controllers/category.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// 🔒 Admin & Seller route for fetching all categories
router.get(
  "/all",
  isAuthenticated,
  authorizeRoles(["admin", "seller"]), // ✅ added 'seller'
  getAllCategories
);

// 🔒 Admin-only routes
router.patch(
  "/:id/toggle",
  isAuthenticated,
  authorizeRoles(["admin"]),
  toggleCategory
);
router.patch(
  "/:id/limit",
  isAuthenticated,
  authorizeRoles(["admin"]),
  updateCategoryLimit
);

// 🌍 Public route (enabled categories)
router.get("/enabled", getEnabledCategories);

export default router;
