import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: Number,
        price: Number,
      },
    ],
    address: {
      fullName: String,
      email: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    total: Number,
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Shipped", "Delivered"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
