import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Labour from "../models/Labour.js";
import Otp from "../models/Otp.js";

// ✅ SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email, role } = req.body;
    console.log("📩 Received OTP request for:", { email, role });

    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!role) return res.status(400).json({ message: "Role is required" });

    const validRoles = ["admin", "buyer", "seller", "labour"];
    if (!validRoles.includes(role))
      return res.status(400).json({ message: "Invalid role" });

    // Check user existence
    const account =
      role === "labour"
        ? await Labour.findOne({ email })
        : await User.findOne({ email });

    console.log("🔍 Account found:", account ? true : false);

    if (!account) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    console.log("🧾 Generated OTP:", otp);
    console.log("⏰ Expires at:", expiresAt);

    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:sans-serif; line-height:1.5;">
          <h2>Password Reset Request</h2>
          <p>Your OTP for resetting your password is:</p>
          <h2 style="color:#2e7d32;letter-spacing:2px;">${otp}</h2>
          <p>This OTP will expire in <strong>5 minutes</strong>.</p>
        </div>
      `,
    });

    // Save OTP
    const otpDoc = await Otp.findOneAndUpdate(
      { email, role },
      { otpHash, expiresAt },
      { upsert: true, new: true, strict: false }
    );

    console.log("💾 OTP saved to DB:", otpDoc);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ OTP send error:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

// ✅ VERIFY OTP AND RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, role } = req.body;
    console.log("🔐 Reset password request:", { email, otp, role, newPassword });

    if (!email || !otp || !newPassword || !role)
      return res.status(400).json({ message: "All fields are required" });

    const validRoles = ["admin", "buyer", "seller", "labour"];
    if (!validRoles.includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const otpRecord = await Otp.findOne({ email, role });
    console.log("📦 OTP record found:", otpRecord);

    if (!otpRecord)
      return res.status(400).json({ message: "OTP not found or expired" });

    if (otpRecord.expiresAt < new Date()) {
      console.log("⚠️ OTP expired");
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);
    console.log("🔍 OTP match result:", isMatch);

    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔑 New hashed password generated:", hashedPassword);

    let updatedUser;

    // Detect correct password field (password or pass)
    const labourDoc = await Labour.findOne({ email });
    const userDoc = await User.findOne({ email });

    let passwordField = "password";
    if (role === "labour" && labourDoc && "pass" in labourDoc) {
      passwordField = "pass";
    } else if (role !== "labour" && userDoc && "pass" in userDoc) {
      passwordField = "pass";
    }

    console.log(`🧠 Detected password field for ${role}:`, passwordField);

    if (role === "labour") {
      updatedUser = await Labour.findOneAndUpdate(
        { email },
        { [passwordField]: hashedPassword },
        { new: true }
      );
      console.log("👷‍♂️ Labour password updated:", updatedUser);
    } else {
      updatedUser = await User.findOneAndUpdate(
        { email },
        { [passwordField]: hashedPassword },
        { new: true }
      );
      console.log("👤 User password updated:", updatedUser);
    }

    if (!updatedUser) {
      console.log("❌ No user found to update password");
      return res.status(404).json({ message: "User not found" });
    }

    // Delete OTP after successful reset
    await Otp.deleteOne({ email, role });
    console.log("🧹 OTP record deleted after successful reset");

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res
      .status(500)
      .json({ message: "Error resetting password", error: err.message });
  }
};
