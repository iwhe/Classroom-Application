const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  timetable: { type: Array, required: true }, // Array of objects representing timetable entries
});

const Timetable = mongoose.model("Timetable", timetableSchema);
module.exports = Timetable;
