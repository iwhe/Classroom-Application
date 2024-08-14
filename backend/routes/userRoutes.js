// routes/userRoutes.js
const express = require("express");
const User = require("../models/user.models.js");
const router = express.Router();

// Get all users (Principal only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get users by classroom (Teacher only)
router.get("/classroom/:classroomId", async (req, res) => {
  try {
    const { classroomId } = req.params;
    const users = await User.find({ classroom: classroomId });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user details (Principal only)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (Principal only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
