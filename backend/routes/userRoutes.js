// routes/user.routes.js
import express from "express";
import {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
  adminLogin,
  verifyToken,
} from "../controller/user.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Admin specific routes
router.post("/admin/login", adminLogin);
router.get("/admin/verify", verifyToken);

// Protected routes
router.get("/", isAuthenticated, authorizeRoles(["admin"]), getUsers);

export default router;
