const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    // ref: "User",
    required: true,
  },
});

const timetableSchema = new Schema(
  {
    classroomName: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    lectureCount: {
      type: Number,
      // required: true,
      default: 0,
    },
    lectures: [lectureSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;
