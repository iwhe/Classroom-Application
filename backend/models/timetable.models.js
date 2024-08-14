const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
  name: { type: String, required: true }, // Name of the lecture
  startTime: { type: String, required: true }, // Start time of the lecture (e.g., '09:00 AM')
  endTime: { type: String, required: true }, // End time of the lecture (e.g., '10:00 AM')
  // subject: { type: String, required: true }, // Subject of the lecture
  teacher: { type: String, required: true }, // Teacher assigned to the lecture
});

const timetableSchema = new Schema({
  classroomName: {
    type: String,
    required: true,
  }, // Name of the classroom
  lectures: [lectureSchema], // Array of lectures for the day
  date: { type: Date, required: true }, // Date of the timetable
});

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;
