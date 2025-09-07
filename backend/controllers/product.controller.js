// backend/controllers/product.controller.js
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// ✅ CREATE PRODUCT - seller
export const createProduct = async (req, res) => {
  try {
    console.log("👤 Authenticated user in createProduct:", req.user);

    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only seller can perform this action",
      });
    }

    const { name, price, weight, quantity, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image required" });
    }

    console.log("📤 Uploading image to Cloudinary...");
    const cloudinaryResponse = await uploadToCloudinary(req.file.buffer, "products");

    console.log("✅ Cloudinary upload success:", cloudinaryResponse.secure_url);

    const product = await Product.create({
      name,
      price,
      weight, // string now
      quantity,
      description,
      category,
      seller: req.user._id,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      status: "pending", // always pending
    });

    console.log("✅ Product created:", product._id);

    res.status(201).json({
      success: true,
      message: "Product created and pending approval",
      product,
    });
  } catch (error) {
    console.error("❌ Product create error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ✅ GET ALL PRODUCTS (Admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("seller", "fullName email");

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

// ✅ GET SELLER'S PRODUCTS
export const getSellerProducts = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only seller can view their products",
      });
    }

    const products = await Product.find({ seller: req.user._id }).populate(
      "category",
      "name"
    );

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching seller products:", error);
    res.status(500).json({ success: false, message: "Error fetching seller products" });
  }
};

// ✅ GET PRODUCTS BY CATEGORY (approved only)
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }

    const products = await Product.find({ category, status: "approved" }).populate(
      "seller",
      "fullName"
    );

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({ success: false, message: "Error fetching products by category" });
  }
};

// ✅ UPDATE PRODUCT STATUS (Admin)
export const updateProductStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only admin can update product status",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const product = await Product.findByIdAndUpdate(id, { status }, { new: true });
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: `Product status updated to ${status}`,
      product,
    });
  } catch (error) {
    console.error("❌ Error updating product status:", error);
    res.status(500).json({ success: false, message: "Error updating product status" });
  }
};
