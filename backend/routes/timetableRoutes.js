const express = require("express");
const Timetable = require("../models/timetable.models.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const {
  createTimetable,
  viewTimetable,
} = require("../controllers/timetable.controller.js");
// const { route } = require("./userRoutes.js");

// Create Timetable
router.route("/create").post(createTimetable);

router.route("/view").get(authMiddleware, viewTimetable);

// Get Timetable
router.get("/view/:classroomId", async (req, res) => {
  const { classroomId } = req.params;
  try {
    const timetable = await Timetable.findOne({ classroom: classroomId });
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timetable", error });
  }
});

module.exports = router;
