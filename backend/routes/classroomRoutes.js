const express = require("express");
const Classroom = require("../models/classroom.models.js");
const User = require("../models/user.models.js");
const {
  viewAllClassroom,
  createClassroom,
  getAllStudentsInClassroom,
  classroomById,
  updateClassroom,
  viewClassroomProfile,
} = require("../controllers/classroom.controller.js");
const router = express.Router();
const { adminCheck } = require("../middleware/admin.middleware.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// Get all users (Principal only)
router.route("/").get(authMiddleware, adminCheck, viewAllClassroom);
router.route("/create").post(authMiddleware, adminCheck, createClassroom);

router
  .route("/allStudentInClass")
  .get(authMiddleware, getAllStudentsInClassroom);

router.route("/:id").get(classroomById);
router.route("/update/:id").put(updateClassroom);

router.route("/viewClassroomProfile/:id").get(viewClassroomProfile);
// Delete Classroom
router.delete("/:id", async (req, res) => {
  try {
    const classroomId = req.params.id;

    // Find and remove the classroom
    const classroom = await Classroom.findByIdAndDelete(classroomId);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Remove classroom reference from the teacher
    await User.findByIdAndUpdate(classroom.teacher, {
      $unset: { classroom: "" },
    });

    // Remove classroom reference from students
    await User.updateMany(
      { _id: { $in: classroom.students } },
      { $unset: { classroom: "" } }
    );

    res.status(200).json({ message: "Classroom deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting classroom" });
  }
});

module.exports = router;
