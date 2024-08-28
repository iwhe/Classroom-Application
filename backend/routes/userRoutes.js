// routes/userRoutes.js
const express = require("express");
const User = require("../models/user.models.js");
const {
  teacherList,
  studentList,
  getAllUsers,
  removeStudentFromClass,
  deleteStudent,
  deleteTeacher,
} = require("../controllers/user.controller.js");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/students").get(studentList);
router.route("/teachers").get(teacherList);
router.route("/student/removeClass/:id").put(removeStudentFromClass);
router.route("/student/:id").delete(deleteStudent);
router.route("/teacher/:id").delete(deleteTeacher);

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
