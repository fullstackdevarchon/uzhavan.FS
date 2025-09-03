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

// ✅ Get all users (protected, for admin later)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-pass"); // don't send password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Register new user
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, pass, role } = req.body;

    // validate role
    const validRoles = ["buyer", "seller", "admin"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // save user
    const newUser = new User({ fullName, email, pass, role });
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
    res.status(400).json({ message: error.message });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  try {
    const { email, pass } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // set cookie and include token in response
    res.cookie("token", token, cookieOptions);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token: token // Include token in response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Logout user
export const logoutUser = (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
  res.json({ message: "Logged out successfully" });
};
