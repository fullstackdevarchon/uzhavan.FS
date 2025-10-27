import express from "express";
import webPush from "../config/webPush.js";

const router = express.Router();

// Temporary memory store for subscriptions
let subscriptions = [];

// ✅ GET VAPID Public Key (for frontend)
router.get("/vapid-key", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// ✅ Subscribe endpoint
router.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log("📩 New subscription added:", subscription);
  res.status(201).json({ message: "Subscription received!" });
});

// ✅ Send test notification
router.post("/send", async (req, res) => {
  const { title, message } = req.body;
  const payload = JSON.stringify({ title, message });

  try {
    const sendPromises = subscriptions.map((sub) =>
      webPush.sendNotification(sub, payload)
    );

    await Promise.all(sendPromises);

    res.status(200).json({ message: "Notifications sent!" });
  } catch (err) {
    console.error("❌ Push error:", err);
    res.status(500).json({ error: "Push failed" });
  }
});

export default router;
