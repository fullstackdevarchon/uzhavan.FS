// backend/controllers/googleAuth.js

import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    // Frontend must send Google ID Token (JWT)
    const idToken = req.body.token || req.body.credential; // Accept 'credential' for new flow

    if (!idToken) {
      return res.status(400).json({ message: "Google token required" });
    }

    // Verify ID Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Extract Google user details
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google email not found" });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        pass: "google_default_password", // ONLY because your model requires pass
        role: "buyer",
      });
    }

    // Generate JWT
    const appToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        picture,
        role: user.role,
      },
      token: appToken,
    });

  } catch (err) {
    console.error("Google Login Error:", err);
    return res.status(500).json({
      message: "Google login failed",
      error: err.message,
    });
  }
};
