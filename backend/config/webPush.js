import webPush from "web-push";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure VAPID keys
webPush.setVapidDetails(
  "mailto:" + process.env.SMTP_USER, // contact email
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default webPush;
