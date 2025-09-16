import Order from "../models/Order.js";
import Product from "../models/Product.js";
import cron from "node-cron";

// ✅ Status flow
const STATUS_FLOW = ["Pending", "Order Placed", "Confirmed", "Shipped", "Delivered"];

// Function to calculate next status
const getNextStatus = (order) => {
  const orderTime = new Date(order.createdAt);
  const now = new Date();
  const diffHours = Math.floor((now - orderTime) / (1000 * 60 * 60));
  let stageIndex = Math.min(Math.floor(diffHours / 2), STATUS_FLOW.length - 1);
  return STATUS_FLOW[stageIndex];
};

// ⏱ CRON JOB: update statuses automatically
cron.schedule("*/10 * * * *", async () => {
  try {
    const orders = await Order.find({
      status: { $nin: ["Delivered", "Cancelled"] },
    });

    for (let order of orders) {
      const nextStatus = getNextStatus(order);
      if (order.status !== nextStatus) {
        order.status = nextStatus;
        await order.save();
        console.log(`🔄 Auto-updated order ${order._id} → ${nextStatus}`);
      }
    }
  } catch (err) {
    console.error("⚠️ Auto status update cron error:", err);
  }
});

//
// ------------------- Buyer Controllers -------------------
//

// ✅ Create order
export const createOrder = async (req, res) => {
  try {
    const { products, address } = req.body;
    const buyer = req.user?._id;

    if (!buyer) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!products || products.length === 0)
      return res.status(400).json({ success: false, message: "No products in order" });

    let subtotal = 0;

    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
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
      subtotal += item.qty * item.price;
    }

    const shipping = 30;
    const total = subtotal + shipping;

    const order = await Order.create({
      buyer,
      products,
      address,
      total,
      paymentMethod: "Cash on Delivery",
      status: "Pending",
      createdAt: new Date(),
    });

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

// ✅ Get my orders (Buyer)
export const getMyOrders = async (req, res) => {
  try {
    let orders = await Order.find({ buyer: req.user._id })
      .populate("products.product", "name images price category")
      .sort({ createdAt: -1 });

    // update status for display
    orders = orders.map((order) => {
      const nextStatus = getNextStatus(order);
      if (order.status !== nextStatus && order.status !== "Cancelled") {
        order.status = nextStatus;
      }
      return order;
    });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Fetch orders error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ✅ Cancel order & restore stock
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!req.user || !req.user._id) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!order.buyer) return res.status(400).json({ success: false, message: "Order has no buyer info" });
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    if (order.status === "Delivered")
      return res.status(400).json({ success: false, message: "Delivered orders cannot be cancelled" });
    if (order.status === "Cancelled")
      return res.status(400).json({ success: false, message: "Order already cancelled" });

    for (let item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.qty;
        product.sold = Math.max(0, product.sold - item.qty);
        await product.save();
      }
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully & stock restored",
      order,
    });
  } catch (err) {
    console.error("❌ Cancel Order Error:", err);
    res.status(500).json({ success: false, message: "Failed to cancel order", error: err.message });
  }
};

//
// ------------------- Admin Controllers -------------------
//

// ✅ Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "fullName email role")
      .populate("products.product", "name price category")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Admin fetch orders error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch all orders" });
  }
};

// ✅ Get order by ID (Admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "fullName email role")
      .populate("products.product", "name price category");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Admin get order error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order details" });
  }
};
