// routes/user.routes.js
import express from "express";
import {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
} from "../controller/user.controller.js";

const router = express.Router();

// ✅ GET all users (without passwords)
router.get("/", getUsers);

// ✅ Register new user
router.post("/register", registerUser);

// ✅ Login user (sets cookie)
router.post("/login", loginUser);

// ✅ Logout user (clears cookie)
router.post("/logout", logoutUser);

export default router;
