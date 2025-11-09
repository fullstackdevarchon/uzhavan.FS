// src/socket.js
import { io } from "socket.io-client";

// ✅ Connect to backend Socket.IO server
export const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"], // fallback
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// ✅ Debug: log connection status
socket.on("connect", () => {
  console.log("⚡ Socket connected:", socket.connected);
  console.log("🆔 Socket ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🛑 Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
});

// ✅ Join a role-specific room (admin, seller, labour, etc.)
export const joinRoom = (role) => {
  if (!role) return console.warn("⚠️ joinRoom called without role");
  socket.emit("joinRoom", { role });
  console.log(`✅ Joined room: ${role}`);
};

// ✅ Send notification to a specific role
export const sendNotification = ({ role, title, message }) => {
  if (!role || !title || !message)
    return console.warn("⚠️ sendNotification called with incomplete data", {
      role,
      title,
      message,
    });

  socket.emit("sendNotification", { role, title, message });
  console.log("📨 Notification sent:", { role, title, message });
};

// ✅ Listen for incoming notifications
export const onReceiveNotification = (callback) => {
  if (typeof callback !== "function") {
    console.warn("⚠️ onReceiveNotification callback is not a function");
    return;
  }
  socket.on("receiveNotification", (data) => {
    console.log("📩 Notification received:", data);
    callback(data);
  });
};

// ✅ Stop listening to notifications
export const offReceiveNotification = () => {
  socket.off("receiveNotification");
  console.log("🛑 Notification listener removed");
};
