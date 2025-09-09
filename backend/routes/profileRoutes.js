// routes/profileRoutes.js
import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Anyone logged in can access
router.get("/", isAuthenticated, getProfile);
router.put("/", isAuthenticated, updateProfile);

// Optional: Only certain roles can access (example)
// router.put("/", isAuthenticated, authorizeRoles(["buyer", "seller"]), updateProfile);

export default router;
