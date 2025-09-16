import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import orderRoutes from "./routes/orderRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import labourRoutes from "./routes/labourRoutes.js"; // ✅ NEW Labour routes

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite frontend
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// API routes
app.use("/api/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/labours", labourRoutes); // ✅ Mount labour routes

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server gracefully...");
  server.close(() => {
    console.log("✅ Server closed.");
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed.");
      process.exit(0);
    });
  });
});
