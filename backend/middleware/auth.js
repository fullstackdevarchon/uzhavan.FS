import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Authentication
export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    console.log("✅ Authenticated user:", {
      id: req.user._id,
      role: req.user.role,
      email: req.user.email,
    });

    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// ✅ Authorization
export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    console.log("🔎 Checking role:", req.user.role, "Allowed roles:", roles);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Only ${roles.join(", ")} can perform this action`,
      });
    }

    next();
  };
};
  