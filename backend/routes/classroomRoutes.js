// // routes/classroomRoutes.js
// const express = require("express");
// const Classroom = require("../models/classroom.models.js");
// const User = require("../models/user.models.js");
// const router = express.Router();

// // Create a classroom
// router.post("/create", async (req, res) => {
//   const { name } = req.body;

//   const classroom = new Classroom({ name });
//   await classroom.save();
//   res.status(201).json(classroom);
// });

// // Assign a teacher to a classroom
// router.post("/assign-teacher", async (req, res) => {
//   const { classroomId, teacherId } = req.body;

//   const classroom = await Classroom.findById(classroomId);
//   if (!classroom)
//     return res.status(404).json({ message: "Classroom not found" });

//   classroom.teacher = teacherId;
//   await classroom.save();
//   res.json(classroom);
// });

// // Assign students to a classroom
// router.post("/assign-students", async (req, res) => {
//   const { classroomId, studentIds } = req.body;

//   const classroom = await Classroom.findById(classroomId);
//   if (!classroom)
//     return res.status(404).json({ message: "Classroom not found" });

//   classroom.students.push(...studentIds);
//   await classroom.save();

//   // Also update the student's classroom field (if needed)
//   await User.updateMany(
//     { _id: { $in: studentIds } },
//     { classroom: classroomId }
//   );

//   res.json(classroom);
// });

// // Get all classrooms
// router.get("/", async (req, res) => {
//   const classrooms = await Classroom.find()
//     .populate("teacher", "name")
//     .populate("students", "name");
//   res.json(classrooms);
// });

// module.exports = router;
// routes/classroomRoutes.js
const express = require("express");
const Classroom = require("../models/classroom.models.js");
const User = require("../models/user.models.js");
const router = express.Router();

// Create Classroom
router.post("/create", async (req, res) => {
  const { name, teacherId } = req.body;

  // Ensure the teacher is not assigned to another classroom
  const existingTeacher = await User.findOne({
    _id: teacherId,
    classroom: { $ne: null },
  });
  if (existingTeacher) {
    return res
      .status(400)
      .json({ message: "Teacher is already assigned to another classroom" });
  }

  const classroom = new Classroom({ name, teacher: teacherId });
  await classroom.save();

  // Assign the teacher to the classroom
  await User.findByIdAndUpdate(teacherId, { classroom: classroom._id });

  res.status(201).json({ message: "Classroom created and teacher assigned" });
});

// Get Classrooms
router.get("/", async (req, res) => {
  const classrooms = await Classroom.find().populate("teacher", "name email");
  res.json(classrooms);
});

module.exports = router;
