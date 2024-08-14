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
    res.status(500).json({ message: "Cannot retrieve Users! Server error" });
  }
});

// Get all students
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Cannot retrieve Students! Server error" });
  }
});

// Get all teachers
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    res.json(teachers);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ message: "Cannot retrieve Teachers! Server error" });
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
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await User.findByIdAndDelete(id);
//     res.json({ message: "User deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// Delete User
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
