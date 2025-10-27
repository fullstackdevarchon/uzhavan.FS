// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import webpush from "web-push";

// ======== ROUTES IMPORT =========
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import labourRoutes from "./routes/labourRoutes.js";
import forgotRoutes from "./routes/forgotRoutes.js";
import pushRoutes from "./routes/notificationRoutes.js";

// ======== CONFIG =========
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// ======== CORS SETUP =========
app.use(
  cors({
    origin: [
      "http://localhost:5173", // seller + buyer
      "http://localhost:5174", // labour
      "http://localhost:5175", // admin
      "http://localhost:5176", // optional
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======== ROUTES SETUP =========
app.use("/api/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/labours", labourRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/forgot", forgotRoutes);
app.use("/api/notifications", pushRoutes); // ✅ Web Push route

// ======== DATABASE CONNECT =========
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ======== SOCKET.IO SETUP =========
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

// ======== WEB PUSH CONFIG =========
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.error("❌ Missing VAPID keys in .env file!");
  process.exit(1);
}

webpush.setVapidDetails(
  "mailto:admin@uzhavan.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// ======== SOCKET.IO CONNECTION =========
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // Join a specific room based on role or id
  socket.on("joinRoom", ({ id, role }) => {
    if (role === "admin") {
      socket.join("admin");
      console.log("🟢 Admin joined room");
    } else if (id) {
      socket.join(id);
      console.log(`🟢 Client ${socket.id} joined room: ${id} (${role})`);
    }
  });

  // Send notification both realtime and as push
  socket.on("sendNotification", async (data) => {
    console.log("📨 Notification received:", data);

    const { role, title, message } = data;
    const payload = JSON.stringify({ title, body: message });

    // ✅ Real-time via Socket.IO
    if (role === "admin") io.to("admin").emit("receiveNotification", data);
    else io.to(role).emit("receiveNotification", data);

    // ✅ Web Push
    try {
      const { default: Subscription } = await import("./models/Subscription.js");
      const subs = await Subscription.find({ role });
      subs.forEach((sub) => {
        webpush
          .sendNotification(sub, payload)
          .then(() => console.log("📬 Web Push sent"))
          .catch((err) => console.error("Push error:", err));
      });
    } catch (err) {
      console.error("❌ Error sending push:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🛑 Client disconnected:", socket.id);
  });
});

// ======== START SERVER =========
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
