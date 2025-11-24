import Order from "../models/Order.js";
import Product from "../models/Product.js";
import cron from "node-cron";
import mongoose from "mongoose";

//
// ------------------- Status Flow -------------------
//
const STATUS_FLOW = ["Order Placed", "Confirmed", "Shipped", "Delivered"];

//
// ------------------- REMOVED AUTO UPDATE -------------------
//   No cron job
//   No auto update
//   No status auto progression
//

//
// ------------------- Buyer Controllers -------------------
//
export const createOrder = async (req, res) => {
  try {
    const { products, address } = req.body;
    const buyer = req.user?._id || req.user?.id;

    if (!buyer) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in again.",
      });
    }
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products in order",
      });
    }

    let subtotal = 0;
    const processedProducts = [];

    for (let item of products) {
      let productId = item?.product ?? item?.productId ?? item?._id ?? item?.id;
      if (productId && typeof productId === "object" && productId._id) {
        productId = productId._id;
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product id: ${productId}`,
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: `Product not found: ${productId}` });
      }
      if (product.quantity < item.qty) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      product.quantity -= item.qty;
      product.sold += item.qty;
      product.buyers.push({
        user: buyer,
        qty: item.qty,
        boughtAt: new Date(),
      });
      await product.save();

      const qty = Number(item.qty);
      const price = Number(item.price);

      processedProducts.push({ product: product._id, qty, price });
      subtotal += qty * price;
    }

    const shipping = 30;
    const total = subtotal + shipping;

    const order = await Order.create({
      buyer,
      products: processedProducts,
      address,
      total,
      paymentMethod: "Cash on Delivery",
      status: "Order Placed",
    });

    order.statusHistory.push({ status: "Order Placed" });
    order.currentStatus = { status: "Order Placed", updatedAt: new Date() };
    await order.save();

    res.status(201).json({
      success: true,
      message: "✅ Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Order create error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("products.product", "name images price category")
      .sort({ createdAt: -1 });

    // ❌ No auto-update — return as saved
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Fetch orders error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to cancel this order" });
    }

    if (order.status === "Delivered") {
      return res
        .status(400)
        .json({ success: false, message: "Delivered orders cannot be cancelled" });
    }

    // Restore product quantities
    for (let item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.qty;
        product.sold = Math.max(0, product.sold - item.qty);
        await product.save();
      }
    }

    order.status = "Cancelled";
    order.currentStatus = {
      status: "Cancelled",
      updatedAt: new Date(),
    };
    order.statusHistory.push({
      status: "Cancelled",
      changedAt: new Date(),
    });
    order.cancelledAt = new Date();

    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Cancel Order Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: err.message,
    });
  }
};

//
// ------------------- Admin Controllers -------------------
//
export const getAllOrders = async (req, res) => {
  try {
    let orders = await Order.find()
      .populate("buyer", "fullName email role")
      .populate("products.product", "name price category")
      .populate("assignedTo", "fullName email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Admin fetch orders error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch all orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "fullName email role")
      .populate("products.product", "name price category")
      .populate("assignedTo", "fullName email role");

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Admin get order error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order details" });
  }
};

//
// ------------------- Labour Controllers -------------------
//
export const assignOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    if (order.isAssigned)
      return res.status(400).json({ success: false, message: "Order already assigned" });

    order.assignedTo = userId;
    order.isAssigned = true;
    order.currentStatus = { status: "Confirmed", updatedAt: new Date() };
    order.status = "Confirmed";

    await order.save();

    res.json({
      success: true,
      message: "Order assigned successfully",
      order,
    });
  } catch (error) {
    console.error("❌ assignOrder error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (!order.assignedTo || order.assignedTo.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not assigned to this order" });
    }

    if (!STATUS_FLOW.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;
    order.currentStatus = { status, updatedAt: new Date() };
    order.statusHistory.push({ status, changedBy: userId });

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Update status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
