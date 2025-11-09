import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "buyer", "seller", "labour"], // ✅ only these roles allowed
    required: true,
  },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("Otp", otpSchema);
