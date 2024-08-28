const mongoose = require("mongoose");
const { asyncHandler } = require("../utils/asyncHandler.js");
const Classroom = require("../models/classroom.models.js");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError.js");
const User = require("../models/user.models.js");

//create classrooms
const createClassroom = asyncHandler(async (req, res) => {
  const {
    className: name,
    assignedTeacher: teacher,
    selectedStudents: students,
    description: description,
  } = req.body;
  console.log(name, description, teacher, students);

  const existingclass = await Classroom.findOne({ name });
  if (existingclass) {
    throw new ApiError(409, "Classroom already exists");
  }

  let teacher__Id;

  if (teacher === "none") {
    teacher__Id = null;
  } else {
    const teachermodel = await User.findById(teacher);
    if (!teachermodel) {
      throw new ApiError(404, "Teacher not found");
    }

    console.log(teacher);

    const assignTeacher = await Classroom.findOne({ teacher: `${teacher}` });
    if (assignTeacher) {
      throw new ApiError(
        409,
        "Teacher has been already assigned to different class"
      );
    }
  }
  try {
    //createClassroom

    const newClassroom = await Classroom.create({
      name,
      teacher: teacher__Id,
      students,
      description,
    });

    //make sure classroom is created successfully
    const createdClassroom = await Classroom.findById(newClassroom._id);

    if (!createdClassroom) {
      throw new ApiError(404, "Something went wrong while creating classroom");
    }
    // console.log(createdClassroom);
    // Assign the classroom to the teacher
    if (teacher__Id) {
      await User.findByIdAndUpdate(teacher__Id, {
        classroom: createdClassroom._id,
      });
    }
    // Assign the classroom to the students
    if (students.length >= 1) {
      await User.updateMany(
        { _id: { $in: students }, role: "student" },
        { classroom: createdClassroom._id }
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, createdClassroom, "Classroom Created Successfully")
      );
  } catch (error) {
    throw new ApiError(200, "Error while creating classroom");
  }
});

//get all the classroom
const viewAllClassroom = asyncHandler(async (req, res) => {
  try {
    const classrooms = await Classroom.find()
      .populate("teacher", "name email password") // Populate teacher's details
      .populate("students", "name email password");
    // console.log(classrooms);
    res
      .status(200)
      .json(
        new ApiResponse(200, classrooms, "Fetched All Classrooms successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Error fetching classrooms");
  }
});

//get classroom profile
const viewClassroomProfile = asyncHandler(async (req, res) => {
  try {
    console.log("params:::", req.params);

    const classId = req.params.id;

    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      throw new ApiError(404, "Classroom cannot be found");
    }

    const classDetails = await Classroom.aggregate([
      {
        $match: {
          _id: classId,
        },
      },
      {
        $lookup: {
          from: "timetables",
          localField: "_id",
          foreignField: "classroomName",
          as: "timetable",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          teacher: 1,
          student: 1,
          timetable: 1,
        },
      },
    ]);

    console.log(classDetails);
    res
      .status(200)
      .json(
        new ApiResponse(200, classDetails[0], "Classroom Found successfully")
      );
  } catch (error) {
    throw new ApiError(400, "Error while getting classroom profile");
  }
});

//get all other students of classroom
const getAllStudentsInClassroom = asyncHandler(async (req, res) => {
  // try {
  const user = req.user.name;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  const userClass = await User.findOne({ name: user });
  if (!userClass) {
    throw new ApiError(400, "User cannot be found in database");
  }
  const classId = userClass.classroom;
  if (!classId) {
    throw new ApiError(404, "User not assigned to any classrooms");
  }

  const classroom = await Classroom.findById(classId).populate("students");

  if (!classroom) {
    throw new ApiError(404, "Classroom not found");
  }
  const AllStudents = classroom.students;
  if (!AllStudents) {
    throw new ApiError(404, "Students not found");
  }

  const sendStudent = AllStudents.map((student) => ({
    _id: student._id,
    name: student.name,
    email: student.email,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(200, sendStudent, "Students to this classroom is found")
    );
  // } catch (error) {
  //   throw new ApiError(500, "Error fetching students to this classroom");
  // }
});

//get assigned teacher in classroom
const getAssignedTeacher = asyncHandler(async (req, res) => {
  try {
    const user = req.user.name;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const userClass = await User.findOne({ name: user });
    if (!userClass) {
      throw new ApiError(401, "User can be found in database");
    }

    const classroom = userClass.classroom;

    if (!classroom) {
      throw new ApiError(404, "Classroom not found");
    }
    const teacher = await Classroom.findById(classroom).populate("teacher");
    const assignedTeacher = classroom.teacher;
    if (!assignedTeacher) {
      throw new ApiError(404, "Teacher not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          assignedTeacher,
          "Assigned Teacher to this classroom is found"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Error fetching assigned teacher to this classroom"
    );
  }
});

//get Classroom by id

const classroomById = asyncHandler(async (req, res) => {
  const classId = req.params.id;

  try {
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      throw new ApiError(404, "Classroom not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, classroom, "Classroom found with the id"));
  } catch (error) {
    throw new ApiError(500, "Classroom cannot be found!");
  }
});

const updateClassroom = asyncHandler(async (req, res) => {
  const classId = req.params.id;

  if (!classId) {
    throw new ApiError(400, "Classroom not found");
  }

  console.log(req.body);

  const {
    classname: name,
    description: description,
    assignedTeacher: teacher,
    selectedStudents: students,
  } = await req.body;

  let teacher__Id;
  console.log({
    name,
    description,
    teacher,
    students,
  });
  if (teacher == "none" || !teacher) {
    teacher__Id = null;
  } else {
    const teachermodel = await User.findById(teacher);
    if (!teachermodel) {
      throw new ApiError(404, "Teacher not found");
    }

    teacher__Id = teacher;

    const assignTeacher = await Classroom.findOne({
      teacher: `${teacher}`,
      _id: { $ne: classId },
    });
    if (assignTeacher) {
      throw new ApiError(
        409,
        "Teacher has been already assigned to different class"
      );
    }
  }

  try {
    const objectIdClassId = new mongoose.Types.ObjectId(classId);
    const classDetails = await Classroom.aggregate([
      {
        $match: {
          _id: objectIdClassId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "classroom",
          as: "userClass",
        },
      },
    ]);
    // console.log("class---->", classDetails);

    const currentUser = classDetails[0].userClass;
    // console.log("Current user--", currentUser);

    const objIDStudent = students.map((id) => new mongoose.Types.ObjectId(id));

    const userToBeRemoved = currentUser.filter(
      (user) => !objIDStudent.includes(user._id.toString())
    );

    // console.log("User to remove", userToBeRemoved);

    const studentsToBeAdded = objIDStudent.filter(
      (id) => !currentUser.includes(id.toString())
    );
    // console.log("Students to be added", studentsToBeAdded);

    const updatedClass = await Classroom.findByIdAndUpdate(
      classId,
      {
        name,
        description,
        teacher: teacher__Id,
        students,
      },
      {
        new: true,
      }
    );

    if (userToBeRemoved.length > 0) {
      const userIdToRemove = userToBeRemoved.map((user) => user._id);
      console.log("id to remove--", userIdToRemove);

      const userRemoved = await User.updateMany(
        { _id: { $in: userIdToRemove } },
        { $unset: { classroom: "" } }
      );
      if (userRemoved) {
        console.log("User removed successfully");
      }
    }

    if (studentsToBeAdded.length > 0) {
      const useradded = await User.updateMany(
        { _id: { $in: studentsToBeAdded } },
        { $set: { classroom: classId } }
      );
      if (useradded) {
        console.log("User added successfully");
      }
    }

    if (!updatedClass) {
      throw new ApiError(404, "Something went wrong while creating classroom");
    }

    console.log(teacher__Id);

    if (teacher__Id) {
      await User.findByIdAndUpdate(teacher__Id, {
        classroom: updatedClass._id,
      });
    }

    console.log("Classroom updated", updatedClass);
    res
      .status(200)
      .json(new ApiResponse(200, updatedClass, "Classroom updated"));
  } catch (error) {
    throw new ApiError(500, "Error updating class", error);
  }
});

module.exports = {
  createClassroom,
  viewAllClassroom,
  getAssignedTeacher,
  viewClassroomProfile,
  getAllStudentsInClassroom,
  classroomById,
  updateClassroom,
};
