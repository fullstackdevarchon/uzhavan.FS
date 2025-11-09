import Order from "../models/Order.js";
import mongoose from "mongoose";

// =============================
// 📦 Get Orders (Assigned + Open)
// =============================
export const getAssignedOrders = async (req, res) => {
  try {
    const labourId = req.user._id;

    // First check if this labour has an active assigned order
    const hasActiveAssigned = await Order.exists({
      assignedTo: labourId,
      status: { $nin: ["Delivered", "Cancelled"] }
    });

    // Always return:
    // 1) ALL orders assigned to me (any status, including Delivered/Cancelled) so 'My Orders' shows history
    // 2) Unassigned active orders that I can take
    const query = {
      $or: [
        { assignedTo: labourId },
        { isAssigned: false, status: { $in: ["Order Placed", "Confirmed", "Shipped"] } }
      ]
    };

    const rawOrders = await Order.find(query)
      .populate("buyer", "fullName email phone")
      .populate("assignedTo", "fullName email")
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });

    // Normalize inconsistent records: isAssigned=true but assignedTo=null
    const orders = rawOrders.map((o) => {
      const obj = o.toObject ? o.toObject() : o;
      if (obj.isAssigned && !obj.assignedTo) {
        const lastChange = Array.isArray(obj.statusHistory) && obj.statusHistory.length > 0
          ? obj.statusHistory[obj.statusHistory.length - 1]
          : null;
        if (lastChange?.changedBy) {
          // Attach a minimal assignedTo for UI purposes
          obj.assignedTo = { _id: lastChange.changedBy };
        }
      }
      return obj;
    });

    res.json({ success: true, orders, hasActiveAssigned: !!hasActiveAssigned });
  } catch (error) {
    console.error("Error fetching assigned orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// =============================
// 📦 Assign Order to Labour
// =============================
export const assignOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const labourId = req.user._id;
    console.log(`👷 assignOrder requested: orderId=${orderId}, labourId=${labourId}`);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1️⃣ Enforce single active order per labour
      const existingActive = await Order.findOne({
        assignedTo: labourId,
        status: { $nin: ["Delivered", "Cancelled"] }
      }).session(session);

      if (existingActive) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message:
            "You already have an active order. Please complete or cancel it before taking another."
        });
      }

      // 2️⃣ Check if already assigned to someone else
      const existingOrder = await Order.findOne({
        _id: orderId,
        isAssigned: true,
        assignedTo: { $ne: labourId }
      }).session(session);

      if (existingOrder) {
        console.warn(
          `⚠️ assignOrder: order ${orderId} already assigned to ${existingOrder.assignedTo}, requested by ${labourId}`
        );
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Order is already assigned to another labour"
        });
      }

      // 3️⃣ Assign order → auto move to Confirmed
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            assignedTo: labourId,
            isAssigned: true,
            status: "Confirmed",
            "currentStatus.status": "Confirmed",
            "currentStatus.updatedAt": new Date()
          },
          $push: {
            statusHistory: {
              status: "Confirmed",
              changedBy: labourId
            }
          }
        },
        { new: true, session }
      )
        .populate("buyer", "fullName email phone")
        .populate("assignedTo", "fullName email")
        .populate("products.product", "name price image");

      if (!order) {
        console.error(`❌ assignOrder: order not found ${orderId}`);
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      await session.commitTransaction();
      session.endSession();

      console.log(
        `✅ assignOrder: order ${order._id} assigned to ${order.assignedTo?._id || order.assignedTo} and moved to Confirmed`
      );

      res.json({
        success: true,
        message: "Order assigned successfully",
        order
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("❌ Error assigning order:", error);
    res.status(500).json({ success: false, message: "Failed to assign order" });
  }
};

// =============================
// 📦 Update Order Status
// =============================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const labourId = req.user._id;
    console.log(`🔄 updateOrderStatus requested: orderId=${orderId}, labourId=${labourId}, newStatus=${status}`);

    // Allowed next statuses
    const validStatuses = ["Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed: Shipped, Delivered"
      });
    }

    let order = await Order.findOne({
      _id: orderId,
      assignedTo: labourId
    });

    if (!order) {
      console.warn(
        `⚠️ updateOrderStatus: order ${orderId} not found or not assigned to labour ${labourId}`
      );
      return res.status(404).json({
        success: false,
        message: "Order not found or not assigned to you"
      });
    }

    const prevStatus = order.status;
    // Update
    order.status = status;
    order.currentStatus = {
      status,
      updatedAt: new Date()
    };
    order.statusHistory.push({
      status,
      changedBy: labourId
    });

    await order.save();

    // Populate for frontend
    order = await Order.findById(order._id)
      .populate("buyer", "fullName email phone")
      .populate("assignedTo", "fullName email")
      .populate("products.product", "name price image");

    console.log(
      `✅ updateOrderStatus: order ${order._id} status ${prevStatus} → ${status} by labour ${labourId}`
    );

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

// =============================
// 📦 Get Order Details
// =============================
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const labourId = req.user._id;

    const order = await Order.findOne({
      _id: orderId,
      $or: [{ assignedTo: labourId }, { isAssigned: false }]
    })
      .populate("buyer", "fullName email phone")
      .populate("products.product", "name price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not accessible"
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order details" });
  }
};
