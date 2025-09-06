import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Dashboard stats route
router.get(
  "/dashboard-stats",
  isAuthenticated,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      // Mock data - replace with real database queries
      const stats = {
        totalProducts: 150,
        pendingSellers: 8,
        totalRevenue: 45000,
        inventoryItems: 180,
        totalOrders: 45,
        activeUsers: 250,
      };

      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
