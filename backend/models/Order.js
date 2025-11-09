import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer is required"],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
      },
    ],
    address: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zip: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Online Payment"],
      default: "Cash on Delivery",
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Pending", "Order Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Order Placed",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    statusHistory: [{
      status: { type: String, required: true },
      changedAt: { type: Date, default: Date.now },
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
    currentStatus: {
      status: { type: String, default: "Order Placed" },
      updatedAt: { type: Date, default: Date.now }
    },
    cancelledAt: { type: Date },
    isAssigned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
