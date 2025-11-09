import express from "express";
import {
  createOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  getOrderById,
  assignOrder, // ✅ import assign controller
} from "../controllers/orderController.js";

import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// ---------------- Buyer Routes ---------------- //
router.post(
  "/create",
  isAuthenticated,
  authorizeRoles(["buyer"]),
  createOrder
);

router.get(
  "/",
  isAuthenticated,
  authorizeRoles(["buyer"]),
  getMyOrders
);

router.put(
  "/:id/cancel",
  isAuthenticated,
  authorizeRoles(["buyer"]),
  cancelOrder
);

// ---------------- Admin Routes ---------------- //
router.get(
  "/admin/all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getAllOrders
);

router.get(
  "/admin/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getOrderById
);

// ---------------- Labour Routes ---------------- //
// Take an order (assign to logged-in labour)
router.put(
  "/:id/assign",
  isAuthenticated,
  authorizeRoles(["labour"]), // ✅ only labour can assign to themselves
  assignOrder
);

export default router;
