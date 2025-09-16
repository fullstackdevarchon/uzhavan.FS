import User from "../models/User.js";

// ✅ Get profile
export const getProfile = async (req, res) => {
  try {
    // Find the user by ID to ensure we have a proper Mongoose document
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Ensure address object exists
    if (!user.address) {
      user.address = {
        street: "",
        city: "",
        district: "",
        state: "",
        country: "",
        pincode: "",
      };
      await user.save();
    }

    res.json({
      success: true,
      user: {
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        phone: user.phone || "",
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Get Profile Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

// ✅ Update profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    
    // Find the user by ID to ensure we have a proper Mongoose document
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user fields if provided
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    // Update address if provided
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

    // Mark the address as modified to ensure it gets saved
    user.markModified('address');
    
    // Save the updated user
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Update Profile Error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Failed to update profile" 
    });
  }
};
