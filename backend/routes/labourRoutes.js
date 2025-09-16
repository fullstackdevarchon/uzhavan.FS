import express from "express";
import { addLabour, getLabours, deleteLabour } from "../controllers/labourController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// ✅ Admin-only access for labour management
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
