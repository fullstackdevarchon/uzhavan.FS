import Category from "../models/Category.js";

/* ======================================================
   ✅ Get All Categories (Admin/Seller)
====================================================== */
export const getAllCategories = async (req, res) => {
  console.log("📥 [GET] Fetching all categories...");
  try {
    const categories = await Category.find().sort({ name: 1 });
    console.log(
      "✅ Categories fetched:",
      categories.map(c => ({
        name: c.name,
        limit: c.limit,
        enabled: c.enabled,
      }))
    );
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

/* ======================================================
   ✅ Get Enabled Categories (for public/sellers)
====================================================== */
export const getEnabledCategories = async (req, res) => {
  console.log("📥 [GET] Fetching enabled categories...");
  try {
    const categories = await Category.find({ enabled: true }).sort({ name: 1 });
    console.log(
      "✅ Enabled categories fetched:",
      categories.map(c => ({
        name: c.name,
        limit: c.limit,
      }))
    );
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("❌ Error fetching enabled categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching enabled categories",
      error: error.message,
    });
  }
};

// ✅ Toggle category enabled/disabled with total limit <= 20
export const toggleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // 🧩 Auto-assign group if missing
    if (!category.group) {
      category.group = category.name.toLowerCase();
    }

    // 🔍 If enabling, check total sum limit first
    if (!category.enabled) {
      const enabledCategories = await Category.find({ enabled: true });

      // ✅ Calculate total limit of enabled categories
      const totalEnabledLimit = enabledCategories.reduce(
        (sum, cat) => sum + (cat.limit || 0),
        0
      );

      // 🧮 Check if enabling this one exceeds total 20
      const newTotal = totalEnabledLimit + (category.limit || 0);
      if (newTotal > 20) {
        return res.status(400).json({
          success: false,
          message: `Cannot enable "${category.name}". Enabling this category would exceed the total allowed limit of 20 products (current total: ${totalEnabledLimit}).`,
        });
      }
    }

    // ✅ Toggle and save
    category.enabled = !category.enabled;
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${category.enabled ? "enabled" : "disabled"} successfully`,
      category,
    });
  } catch (error) {
    console.error("Toggle Error:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling category",
      error: error.message,
    });
  }
};



/* ======================================================
   ✅ Update Category Limit (Total limit ≤ 20)
====================================================== */
export const updateCategoryLimit = async (req, res) => {
  console.log("📥 [PATCH] Update category limit request");
  console.log("🔹 Params:", req.params.id);
  console.log("🔹 Body:", req.body);

  try {
    let { limit } = req.body;
    limit = Number(limit);
    console.log("🔸 Parsed limit:", limit);

    // Validation
    if (!limit || isNaN(limit) || limit < 1) {
      console.warn("⚠️ Invalid limit value:", limit);
      return res.status(400).json({
        success: false,
        message: "Invalid limit value. Limit must be a number ≥ 1.",
      });
    }

    // Find category
    const category = await Category.findById(req.params.id);
    if (!category) {
      console.warn("⚠️ Category not found:", req.params.id);
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    console.log("🔍 Found:", category.name, "| Current limit:", category.limit);

    // Get all categories
    const allCategories = await Category.find();
    console.log("📦 Total categories:", allCategories.length);

    // Calculate total excluding current category
    const totalOtherLimits = allCategories
      .filter(cat => cat._id.toString() !== category._id.toString())
      .reduce((sum, cat) => sum + (cat.limit || 0), 0);

    console.log("🧮 Other limits total:", totalOtherLimits);

    const newTotal = totalOtherLimits + limit;
    console.log("🧾 New total after update:", newTotal);

    if (newTotal > 20) {
      console.warn(`🚫 Limit exceeded! Total (${newTotal}) > 20.`);
      return res.status(400).json({
        success: false,
        message: `Cannot update. Total limit would become ${newTotal}, exceeding the allowed 20.`,
      });
    }

    // Save update
    category.limit = limit;
    category.group = category.name.toLowerCase();
    await category.save();

    console.log(
      `✅ '${category.name}' limit updated to ${limit}. Total used: ${newTotal}/20`
    );

    res.status(200).json({
      success: true,
      message: `Category limit updated to ${limit}. Total used: ${newTotal}/20.`,
      category,
    });
  } catch (error) {
    console.error("❌ Update Category Limit Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating category limit.",
      error: error.message,
    });
  }
};
