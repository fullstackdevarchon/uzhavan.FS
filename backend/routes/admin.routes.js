import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/admin/dashboard-stats
 * Returns dashboard statistics for admin
 */
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

      res.status(200).json({ success: true, stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/**
 * POST /api/admin/notify
 * Send a real-time notification to a specific role (admin, labour, user)
 * Body: { role, title, message }
 */
router.post(
  "/notify",
  isAuthenticated,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const io = req.app.get("io"); // Get Socket.IO instance
      const { role, title, message } = req.body;

      if (!role || !title || !message) {
        return res.status(400).json({
          success: false,
          message: "Role, title, and message are required",
        });
      }

      // Emit the notification to the specified role
      io.to(role).emit("receiveNotification", { title, message });
      console.log("📣 Notification sent:", { role, title, message });

      res.status(200).json({
        success: true,
        message: `Notification sent to ${role}`,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
