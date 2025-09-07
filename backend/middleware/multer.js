// middleware/multer.js
import multer from "multer";

// Memory storage for Cloudinary
const storage = multer.memoryStorage();

const singleUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("image");

export { singleUpload };
