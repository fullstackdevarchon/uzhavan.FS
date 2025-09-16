// controllers/user.controller.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: "/",
};

// =======================
// Get all users (Admin protected)
// =======================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-pass"); // exclude password
    res.json(users);
  } catch (error) {
    console.error("❌ getUsers error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Register new user
// =======================
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, pass, role } = req.body;

    // Validate role
    const validRoles = ["buyer", "seller", "admin"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Hash password ONCE
    // const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = new User({
      fullName,
      email,
      pass,
      role,
      isApproved: role === "seller" ? false : true,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ registerUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Login user
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, pass } = req.body;
    console.log("Attempting login for:", req.body);

    if (!email || !pass) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+pass");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("DB password:", user.pass);
    console.log("Stored password type:", user.pass.startsWith("$2b$") ? "HASHED" : "PLAIN");

    // ✅ Compare raw password with stored hash
    const isMatch = await bcrypt.compare(pass, user.pass);
    console.log('pass',pass)
    console.log('user.pass',user.pass)
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ loginUser error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =======================
// Admin login
// =======================
export const adminLogin = async (req, res) => {
  try {
    const { email, pass } = req.body;
    console.log("Attempting admin login:", email);

    if (!email || !pass) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+pass");
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" });
    }

    console.log("DB password:", user.pass);
    console.log("Stored password type:", user.pass.startsWith("$2b$") ? "HASHED" : "PLAIN");

    const isMatch = await bcrypt.compare(pass, user.pass);
    console.log("🔑 Admin password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    res.json({
      message: "Admin login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ adminLogin error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Logout user
// =======================
export const logoutUser = (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
  res.json({ message: "Logged out successfully" });
};

// =======================
// Verify JWT token
// =======================
export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    res.json({
      message: "Token is valid",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ verifyToken error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
