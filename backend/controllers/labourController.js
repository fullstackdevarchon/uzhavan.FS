import Labour from "../models/Labour.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookieOptions.js"; // ✅ utility for cookies

// ✅ Add Labour
export const addLabour = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existing = await Labour.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // 🔒 Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newLabour = new Labour({
      fullName,
      email,
      password: hashedPassword,
      role: role || "labour",
    });
    await newLabour.save();

    res.status(201).json({
      success: true,
      message: "Labour added successfully",
      user: {
        _id: newLabour._id,
        fullName: newLabour.fullName,
        email: newLabour.email,
        role: newLabour.role,
      },
    });
  } catch (error) {
    console.error("Add Labour Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get All Labours
export const getLabours = async (req, res) => {
  try {
    const labours = await Labour.find().select("-password");
    res.json({ success: true, labours });
  } catch (error) {
    console.error("Get Labours Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete Labour
export const deleteLabour = async (req, res) => {
  try {
    const { id } = req.params;
    await Labour.findByIdAndDelete(id);
    res.json({ success: true, message: "Labour deleted successfully" });
  } catch (error) {
    console.error("Delete Labour Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Login Labour/Admin
export const loginLabour = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Attempting login for:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const user = await Labour.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables");
      return res
        .status(500)
        .json({ success: false, message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
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
    console.error("❌ loginLabour error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
