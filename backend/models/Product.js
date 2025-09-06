import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"]
  },
  description: {
    type: String,
    required: [true, "Please enter product description"]
  },
  weight: {
    type: String,
    required: [true, "Please enter product weight"]
  },
  quantity: {
    type: Number,
    required: [true, "Please enter product quantity"]
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: {
      values: ["spices", "vegetables", "fruits"],
      message: "Please select correct category"
    }
  },
  image: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Product", productSchema);