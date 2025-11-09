// utils/pushService.js
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:youremail@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Send web push notification to a subscribed user
export const sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log("✅ Push notification sent successfully");
  } catch (err) {
    console.error("❌ Error sending push:", err);
  }
};
