import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // ✅ Added for secure reset token

// Address schema
const addressSchema = new mongoose.Schema({
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  district: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  pincode: { type: String, default: "" },
});

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    pass: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // exclude password unless explicitly requested
    },
    role: {
      type: String,
      enum: ["admin", "buyer", "seller"],
      default: "buyer",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    address: { type: addressSchema, default: () => ({}) },
    phone: { type: String, default: "" },

    // 🔹 Added Forgot Password fields
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  { timestamps: true }
);

// 🔹 Hash password automatically before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("pass")) return next();
  this.pass = await bcrypt.hash(this.pass, 10);
  next();
});

// 🔹 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.pass);
};

// 🔹 Generate JWT
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// 🔹 Update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

// 🔹 Static: find user by email (with password)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select("+pass");
};

// 🔹 Generate and Hash Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving to DB
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiry time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Return plain token for sending to user (email or SMS)
  return resetToken;
};

export default mongoose.model("User", userSchema);
