import express from "express";
import {
  getAllCategories,
  getEnabledCategories,
  toggleCategory,
  updateCategoryLimit,
} from "../controllers/category.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// 🔒 Admin routes
router.get(
  "/all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getAllCategories
);
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

// 🌍 Public route
router.get("/enabled", getEnabledCategories);

export default router;
