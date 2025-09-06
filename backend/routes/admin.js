import express from "express";
const router = express.Router();

router.get("/dashboard-stats", (req, res) => {
  res.json({
    totalProducts: 150,
    pendingSellers: 8,
    totalRevenue: 45000,
    inventoryItems: 180,
    totalOrders: 45,
    activeUsers: 250
  });
});

export default router;