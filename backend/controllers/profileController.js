import User from "../models/User.js";

// ✅ Get profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    // Ensure address object exists
    const address = user.address || {
      street: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    };

    res.json({
      fullName: user.fullName,
      email: user.email,
      address,
      phone: user.phone || "",
      role: user.role,
    });
  } catch (err) {
    console.error("❌ Get Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

// ✅ Update profile
export const updateProfile = async (req, res) => {
  try {
    const { address, phone } = req.body;
    const user = req.user;

    // Update only provided fields
    if (address) {
      user.address = {
        street: address.street || user.address?.street || "",
        city: address.city || user.address?.city || "",
        district: address.district || user.address?.district || "",
        state: address.state || user.address?.state || "",
        country: address.country || user.address?.country || "",
        pincode: address.pincode || user.address?.pincode || "",
      };
    }

    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Update Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};
