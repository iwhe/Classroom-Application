const { asyncHandler } = require("../utils/asyncHandler.js");
const Timetable = require("../models/timetable.models.js");
const { ApiError } = require("../utils/ApiError");
const Classroom = require("../models/classroom.models.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

//Create a timetable
const createTimetable = asyncHandler(async (req, res) => {
  const { classroomName, numLectures, lectures } = req.body;

  if (!(classroomName || numLectures || lectures)) {
    throw new ApiError(400, "Missing required fields. All fields required");
  }
  console.log({ classroomName, numLectures, lectures });

  const classroom = await Classroom.findOne({ name: classroomName });
  console.log("CLASS:", classroom);

  if (!classroom) {
    throw new ApiError(404, "Classroom deos not exist");
  }
  const classId = classroom._id;
  const timetable = await Timetable.findOneAndUpdate(
    { classroomName: classId },
    {
      classroomName: classId,
      lectureCount: numLectures,
      lectures: lectures,
      lectures: lectures.map((lecture) => ({
        name: lecture.name,
        startTime: lecture.startTime,
        endTime: lecture.endTime,
        teacher: lecture.teacher,
      })),
    },
    { new: true, upsert: true }
  );

  const createdTimetable = await Timetable.findById(timetable._id);
  if (!createdTimetable) {
    throw new ApiError(409, "Timetable cannot be created");
  }

  await Classroom.findByIdAndUpdate(classId, { timetable: timetable._id });

  res
    .status(200)
    .json(
      new ApiResponse(200, createdTimetable, "Timetable created successfully")
    );
  //   } catch (error) {
  //     throw new ApiError(500, "Error while creating timetable");
  //   }
});

//Timetable of the user class
const viewTimetable = asyncHandler(async (req, res) => {
  const user = req.user;
  const classId = user.classroom;
  if (!classId) {
    throw new ApiError(400, "Class ID not found");
  }

  const timetable = await Timetable.findOne({
    classroomName: classId,
  }).populate({
    path: "classroomName",
    select: "name",
  });

  if (!timetable) {
    throw new ApiError(404, "timetable not found");
  }
  console.log(timetable);

  res
    .status(200)
    .json(new ApiResponse(200, timetable, "Timetable found successfully"));
});

module.exports = {
  viewTimetable,
  createTimetable,
};
