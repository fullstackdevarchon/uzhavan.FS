import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import {
  createOrder,
  getMyOrders,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Create order (buyer only)
router.post("/create", isAuthenticated, authorizeRoles(["buyer"]), createOrder);

// Get logged-in buyer orders
router.get("/", isAuthenticated, authorizeRoles(["buyer"]), getMyOrders);

// Cancel an order
router.put("/:id/cancel", isAuthenticated, authorizeRoles(["buyer"]), cancelOrder);

export default router;
