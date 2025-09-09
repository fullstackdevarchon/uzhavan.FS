import Category from "../models/Category.js";

// Get all categories (Admin/Seller)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Get enabled categories (for sellers/public)
export const getEnabledCategories = async (req, res) => {
  try {
    const categories = await Category.find({ enabled: true }).sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching enabled categories",
      error: error.message,
    });
  }
};

// Toggle category enabled/disabled
export const toggleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.enabled = !category.enabled;
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${category.enabled ? "enabled" : "disabled"} successfully`,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling category",
      error: error.message,
    });
  }
};

// Update category limit
export const updateCategoryLimit = async (req, res) => {
  try {
    const { limit } = req.body;

    if (!limit || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Limit must be at least 1",
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { limit },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category limit updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating category limit",
      error: error.message,
    });
  }
};
