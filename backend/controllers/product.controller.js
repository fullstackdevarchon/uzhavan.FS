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
 * ✅ CREATE PRODUCT (Seller only)
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
      sold: false,
      buyers: [],
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
      .populate("seller", "fullName email")
      .populate("buyers.user", "fullName email");

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

    const products = await Product.find({ seller: req.user._id })
      .populate("category", "name")
      .populate("buyers.user", "fullName email");

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
 * ✅ GET PRODUCT BY ID (any user)
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("seller", "fullName email");

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error);
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

/**
 * ✅ GET PRODUCTS BY CATEGORY (approved only, in stock)
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
      quantity: { $gt: 0 },
    }).populate("seller", "fullName");

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({ success: false, message: "Error fetching products by category" });
  }
};

/**
 * ✅ GET SIMILAR PRODUCTS (exclude current)
 */
export const getSimilarProducts = async (req, res) => {
  try {
    const { category, excludeId } = req.query;

    const products = await Product.find({
      category,
      _id: { $ne: excludeId },
      status: "approved",
      quantity: { $gt: 0 },
    }).limit(10);

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching similar products:", error);
    res.status(500).json({ success: false, message: "Error fetching similar products" });
  }
};

/**
 * ✅ UPDATE PRODUCT STATUS (Admin only)
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
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

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
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (req.user.role === "seller" && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You can only delete your own products",
      });
    }

    if (product.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(product.image.public_id);
        console.log("🗑️ Deleted product image from Cloudinary:", product.image.public_id);
      } catch (cloudErr) {
        console.warn("⚠️ Cloudinary deletion failed:", cloudErr.message);
      }
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};

/**
 * ✅ MARK PRODUCT AS SOLD (Buyer purchase)
 */
export const markAsSold = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "buyer") {
      return res.status(403).json({ success: false, message: "Forbidden. Only buyers can purchase products" });
    }

    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.status !== "approved") return res.status(400).json({ success: false, message: "Product not available for purchase" });
    if (product.quantity <= 0) return res.status(400).json({ success: false, message: "Product out of stock" });

    product.quantity -= 1;
    product.buyers = product.buyers || [];
    product.buyers.push({ user: req.user._id, purchasedAt: new Date() });
    if (product.quantity === 0) product.sold = true;

    await product.save();

    res.status(200).json({ success: true, message: "Product purchased successfully", product });
  } catch (error) {
    console.error("❌ Error marking product as sold:", error);
    res.status(500).json({ success: false, message: "Error marking product as sold" });
  }
};

/**
 * ✅ GET PRODUCTS FOR BUYER (approved, in stock, optional category)
 */
export const getBuyerProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: "approved", quantity: { $gt: 0 } };
    if (category) filter.category = category;

    const products = await Product.find(filter).populate("category", "name");

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching buyer products:", error);
    res.status(500).json({ success: false, message: "Error fetching buyer products" });
  }
};
// controllers/product.controller.js

export const updateProductStock = async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    if (quantity === undefined || isNaN(quantity)) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if logged-in seller owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Update quantity
    product.quantity = Number(quantity);
    await product.save();

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("❌ Update stock error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
