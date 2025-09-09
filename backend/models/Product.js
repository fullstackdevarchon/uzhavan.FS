import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    weight: { type: String, required: true },

    // 🔹 stock
    quantity: { type: Number, default: 1 },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      public_id: { type: String },
      url: { type: String },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },

    // 🔹 Sales tracking
    sold: { type: Number, default: 0 }, // total units sold
    buyers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        qty: { type: Number, default: 1 },
        boughtAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
