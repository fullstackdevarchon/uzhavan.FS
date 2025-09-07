// backend/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  weight: { type: String, required: true }, // changed from Number → String
  quantity: { type: Number, default: 1 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
