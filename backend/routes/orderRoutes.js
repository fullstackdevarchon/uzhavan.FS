import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import {
  createOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  getOrderById,
} from "../controllers/orderController.js";

const router = express.Router();

// Buyer routes
router.post("/create", isAuthenticated, authorizeRoles(["buyer"]), createOrder);
router.get("/", isAuthenticated, authorizeRoles(["buyer"]), getMyOrders);
router.put("/:id/cancel", isAuthenticated, authorizeRoles(["buyer"]), cancelOrder);

// Admin routes
router.get("/admin/all", isAuthenticated, authorizeRoles(["admin"]), getAllOrders);
router.get("/admin/:id", isAuthenticated, authorizeRoles(["admin"]), getOrderById);

export default router;
