// controllers/productController.js
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Helper: Upload buffer to Cloudinary
 */
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * ✅ CREATE PRODUCT (Seller)
 */
export const createProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only sellers can perform this action",
      });
    }

    const { name, price, weight, quantity, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image required" });
    }

    const cloudinaryResponse = await uploadToCloudinary(req.file.buffer, "products");

    const product = await Product.create({
      name,
      price,
      weight,
      quantity,
      description,
      category,
      seller: req.user._id,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      status: "pending",
    });

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

/**
 * ✅ GET ALL PRODUCTS (Admin)
 */
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

/**
 * ✅ GET SELLER'S PRODUCTS
 */
export const getSellerProducts = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only sellers can view their products",
      });
    }

    const products = await Product.find({ seller: req.user._id }).populate("category", "name");

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching seller products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching seller products",
    });
  }
};

/**
 * ✅ GET PRODUCTS BY CATEGORY (approved only)
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }

    const products = await Product.find({
      category,
      status: "approved",
    }).populate("seller", "fullName");

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products by category",
    });
  }
};

/**
 * ✅ UPDATE PRODUCT STATUS (Admin)
 */
export const updateProductStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only admin can update product status",
      });
    }

    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updateData = { status };
    if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

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

/**
 * ✅ DELETE PRODUCT (Admin → any, Seller → only own)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // If seller → ensure they own the product
    if (req.user.role === "seller" && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You can only delete your own products",
      });
    }

    // Delete product image from Cloudinary if exists
    if (product.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(product.image.public_id);
        console.log("🗑️ Deleted product image from Cloudinary:", product.image.public_id);
      } catch (cloudErr) {
        console.warn("⚠️ Cloudinary deletion failed:", cloudErr.message);
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};
