import Labour from "../models/Labour.js";

// ✅ Add Labour
export const addLabour = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existing = await Labour.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const newLabour = new Labour({ fullName, email, password, role: role || "labour" });
    await newLabour.save();

    res.status(201).json({
      success: true,
      message: "Labour added successfully",
      user: {
        _id: newLabour._id,
        fullName: newLabour.fullName,
        email: newLabour.email,
        role: newLabour.role,
      },
    });
  } catch (error) {
    console.error("Add Labour Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get All Labours
export const getLabours = async (req, res) => {
  try {
    const labours = await Labour.find().select("-password");
    res.json({ success: true, labours });
  } catch (error) {
    console.error("Get Labours Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete Labour
export const deleteLabour = async (req, res) => {
  try {
    const { id } = req.params;
    await Labour.findByIdAndDelete(id);
    res.json({ success: true, message: "Labour deleted successfully" });
  } catch (error) {
    console.error("Delete Labour Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
