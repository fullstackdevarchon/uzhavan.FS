import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Spices", "Vegetables", "Fruits"], // ✅ restricts values
      unique: true,
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    limit: {
      type: Number,
      required: true,
      min: 1,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);
