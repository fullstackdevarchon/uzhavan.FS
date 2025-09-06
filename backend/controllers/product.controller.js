import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import { getDataUri } from '../utils/DataUri.js';

export const createProduct = async (req, res) => {
  try {
    const { name, price, weight, quantity, description, category } = req.body;

    // Validate category
    if (!["spices", "vegetables", "fruits"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category selected"
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Product image is required" 
      });
    }

    // Convert buffer to DataURI
    const fileUri = getDataUri(req.file);

    // Upload to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content, {
      folder: 'products',
      width: 1000,
      crop: "scale"
    });

    // Create product
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
        url: cloudinaryResponse.secure_url
      }
      // status will be "pending" by default
    });

    res.status(201).json({
      success: true,
      message: "Product submitted for approval",
      product
    });

  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Validate category
    if (!["spices", "vegetables", "fruits"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category"
      });
    }

    const products = await Product.find({ 
      category,
      status: "approved" 
    }).populate("seller", "fullName email");

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};

// Get all products for admin
export const getAllProducts = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filters = {};

    // Add filters if provided
    if (category) filters.category = category;
    if (status) filters.status = status;

    const products = await Product.find(filters)
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};

// Update product status (admin only)
export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Product ${status} successfully`,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product status",
      error: error.message
    });
  }
};