// routes/labourRoutes.js
import express from "express";
import {
  addLabour,
  getLabours,
  deleteLabour,
  loginLabour,
} from "../controllers/labourController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js"; // ✅ import login

const router = express.Router();

/**
 * ========================
 * 🔑 Authentication Routes
 * ========================
 */

// ✅ Login route (public access)
router.post("/login", loginLabour); // POST /api/labours/login

/**
 * ========================
 * 👷 Labour Management (Admin-only)
 * ========================
 */

router.post(
  "/add",
  isAuthenticated,
  authorizeRoles(["admin"]),
  addLabour
); // POST /api/labours/add

router.get(
  "/",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getLabours
); // GET /api/labours

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  deleteLabour
); // DELETE /api/labours/:id

export default router;
