import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// GET /api/auth/verify
router.get("/verify", isAuthenticated, (req, res) => {
  // req.user is set by middleware
  return res.json({ success: true, user: req.user });
});

export default router;
