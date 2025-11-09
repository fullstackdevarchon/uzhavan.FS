import express from "express";
import {
  addLabour,
  getLabours,
  deleteLabour,
  loginLabour,
} from "../controllers/labourController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import {
  getAssignedOrders,
  assignOrder,
  updateOrderStatus,
  getOrderDetails
} from "../controllers/labourOrderController.js";

const router = express.Router();

/**
 * ========================
 * 🔑 Authentication Routes
 * ========================
 */

// Login (labour)
router.post("/login", loginLabour); // POST /api/labours/login

/**
 * ========================
 * 📦 Order Management (Labour)
 * ========================
 */

// Get all relevant orders (assigned to me + open ones)
router.get(
  "/orders",
  isAuthenticated,
  authorizeRoles(["labour"]),
  getAssignedOrders
);

// Assign order
router.post(
  "/orders/:orderId/assign",
  isAuthenticated,
  authorizeRoles(["labour"]),
  assignOrder
);

// Update order status
router.put(
  "/orders/:orderId/status",
  isAuthenticated,
  authorizeRoles(["labour"]),
  updateOrderStatus
);

// Get single order details
router.get(
  "/orders/:orderId",
  isAuthenticated,
  authorizeRoles(["labour"]),
  getOrderDetails
);

/**
 * ========================
 * 👷 Labour Management (Admin)
 * ========================
 */

router.post(
  "/add",
  isAuthenticated,
  authorizeRoles(["admin"]),
  addLabour
);

router.get(
  "/",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getLabours
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  deleteLabour
);

export default router;
