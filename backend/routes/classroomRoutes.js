const express = require("express");
const Classroom = require("../models/classroom.models.js");
const User = require("../models/user.models.js");
const router = express.Router();

// Get all users (Principal only)
router.get("/", async (req, res) => {
  try {
    // Fetch all classrooms and populate the teacher and students fields
    const classrooms = await Classroom.find()
      .populate("teacher", "name email") // Populate teacher's details
      .populate("students", "name email"); // Populate students' details

    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classrooms", error });
  }
});

/// Create Classroom
router.post("/create", async (req, res) => {
  const { className, assignedTeacher, selectedStudents } = req.body;

  try {
    // Create the new classroom
    const newClassroom = new Classroom({
      name: className,
      teacher: assignedTeacher,
      students: selectedStudents,
    });

    await newClassroom.save();

    // Assign the classroom to the teacher
    await User.findByIdAndUpdate(assignedTeacher, {
      classroom: newClassroom._id,
    });

    // Assign the classroom to the students
    await User.updateMany(
      { _id: { $in: selectedStudents }, role: "student" },
      { classroom: newClassroom._id }
    );

    res.status(201).json({ message: "Classroom created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating classroom", error });
  }
});

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
