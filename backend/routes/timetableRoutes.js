// // routes/timetableRoutes.js
// const express = require('express');
// const Timetable = require('../models/Timetable');
// const router = express.Router();

// // Create timetable (Teacher)
// router.post('/create', async (req, res) => {
//     const { class: className, teacherId, timetable } = req.body;

//     const newTimetable = new Timetable({
//         class: className,
//         teacher: teacherId,
//         timetable: timetable,
//     });

//     await newTimetable.save();
//     res.status(201).json({ message: 'Timetable created' });
// });

// // View timetable (Student)
// router.get('/view/:classId', async (req, res) => {
//     const { classId } = req.params;

//     const timetable = await Timetable.findOne({ class: classId }).populate('teacher', 'name email');
//     if (!timetable) {
//         return res.status(404).json({ message: 'Timetable not found' });
//     }

//     res.json(timetable);
// });

// module.exports = router;
// routes/timetableRoutes.js
const express = require("express");
const Timetable = require("../models/timetable.models.js");
const router = express.Router();

// Create Timetable
router.post("/create", async (req, res) => {
  const { classroomId, timetable } = req.body;

  const newTimetable = new Timetable({
    classroom: classroomId,
    timetable: timetable,
  });

  await newTimetable.save();
  res.status(201).json({ message: "Timetable created" });
});

// Get Timetable
router.get("/view/:classroomId", async (req, res) => {
  const { classroomId } = req.params;
  const timetable = await Timetable.findOne({ classroom: classroomId });

  if (!timetable) {
    return res.status(404).json({ message: "Timetable not found" });
  }

  res.json(timetable);
});

module.exports = router;
