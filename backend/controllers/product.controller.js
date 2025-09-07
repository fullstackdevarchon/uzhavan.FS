import Category from "../models/Category.js";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// Helper: upload buffer to Cloudinary
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

// ✅ CREATE PRODUCT (Seller)
export const createProduct = async (req, res) => {
  try {
    console.log("👤 Authenticated user in createProduct:", req.user);

    if (!req.user || req.user.role !== "seller") {
      console.warn("⚠️ Forbidden attempt by non-seller:", req.user?.role);
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only seller can perform this action",
      });
    }

    const { name, price, weight, quantity, description, category } = req.body;
    console.log("📝 Product input data:", {
      name,
      price,
      weight,
      quantity,
      description,
      category,
    });

    if (!req.file) {
      console.warn("⚠️ No image file provided in request");
      return res.status(400).json({ success: false, message: "Image required" });
    }

    console.log("📤 Uploading image to Cloudinary...");
    const cloudinaryResponse = await uploadToCloudinary(req.file.buffer, "products");
    console.log("✅ Cloudinary upload success:", cloudinaryResponse);

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

    console.log("✅ Product created successfully:", product);

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
    console.log("🔎 Fetching all products...");
    const products = await Product.find()
      .populate("category", "name")
      .populate("seller", "fullName email");

    console.log(`✅ Found ${products.length} products`);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

// ✅ GET SELLER'S PRODUCTS
export const getSellerProducts = async (req, res) => {
  try {
    console.log("👤 Seller requesting products:", req.user);

    if (!req.user || req.user.role !== "seller") {
      console.warn("⚠️ Forbidden attempt by non-seller:", req.user?.role);
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only seller can view their products",
      });
    }

    const products = await Product.find({ seller: req.user._id }).populate(
      "category",
      "name"
    );

    console.log(`✅ Found ${products.length} products for seller ${req.user._id}`);
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
    console.log("🔎 Fetching products by category:", category);

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      console.warn("⚠️ Invalid category ID:", category);
      return res.status(400).json({ success: false, message: "Invalid category" });
    }

    const products = await Product.find({ category, status: "approved" }).populate(
      "seller",
      "fullName"
    );

    console.log(`✅ Found ${products.length} approved products in category ${category}`);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({ success: false, message: "Error fetching products by category" });
  }
};

// ✅ UPDATE PRODUCT STATUS (Admin)
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
    res.status(500).json({ success: false, message: "Error updating product status" });
  }
};

// ✅ DELETE PRODUCT (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only admin can delete products",
      });
    }

    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // If image exists in Cloudinary → delete it
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
