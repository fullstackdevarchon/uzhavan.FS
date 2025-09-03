// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema
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
    },
    role: {
      type: String,
      enum: ["admin", "buyer", "seller"], // ✅ allowed roles
      default: "buyer", // ✅ default role
    },
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("pass")) return next();
  try {
    this.pass = await bcrypt.hash(this.pass, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔑 Method to compare passwords during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.pass);
};

export default mongoose.model("User", userSchema);
