import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Utility function to generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Utility function to set token in cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};

export const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        token = authHeader;
      }
    }

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ 
        success: false, 
        message: "Please login to access this resource" 
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.error('❌ User not found for token:', { 
          decoded,
          token: token.substring(0, 20) + '...' 
        });
        return res.status(401).json({ 
          success: false, 
          message: "User not found. Please log in again." 
        });
      }

      // If token is about to expire soon (in next 15 minutes), refresh it
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp - now < 900) { // 15 minutes in seconds
        const newToken = generateToken(user);
        setTokenCookie(res, newToken);
        console.log('🔄 Refreshed token for user:', user._id);
      }

      // Attach user to request
      req.user = {
        _id: user._id,
        id: user._id, // Add both _id and id for compatibility
        role: user.role,
        email: user.email,
        name: user.name
      };
      
      console.log('🔑 Authenticated user:', { 
        id: user._id, 
        role: user.role 
      });
      
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // If token is expired, try to refresh it using refresh token if available
        // For now, we'll just return an error and let the client handle login
        return res.status(401).json({ 
          success: false, 
          message: "Session expired. Please log in again.",
          code: "TOKEN_EXPIRED"
        });
      }
      throw error; // Re-throw other errors
    }
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({ 
      success: false, 
      message: "Authentication failed. Please log in again.",
      error: error.message
    });
  }
};

export const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. No user found in request" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Only ${roles.join(", ")} can perform this action`,
      });
    }

    next();
  };
};
