import express from "express";
import { sendOtp, resetPassword } from "../controllers/forgotController.js";

const router = express.Router();

// Send OTP
router.post("/send-otp", sendOtp);

// Reset password
router.post("/reset-password", resetPassword);

export default router;
