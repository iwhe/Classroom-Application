const { asyncHandler } = require("../utils/asyncHandler.js");
const User = require("../models/user.models.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const Classroom = require("../models/classroom.models.js");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh token and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log(`Email:${email}, name:${name}, role:${role}`);

  if ([name, email, password, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill in all fields");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { name }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists!");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(404, "Something went wrong while creating user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});

let options = {
  httpOnly: true,
  secure: true,
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({ email });
  // console.log(user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  // console.log(accessToken, refreshToken);

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshToken,
        },
        "Logged in Successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged out Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // console.log(req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched succesfully"));
});

//list of all the teachers
const teacherList = asyncHandler(async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("-password -refreshToken")
      .populate("classroom");

    const teacherDetails = teachers.map((teacher) => ({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      classroom: teacher.classroom,
    }));

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          teacherDetails,
          "All teachers fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error while getting teacher list");
  }
});

//list of all the students
const studentList = asyncHandler(async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password -refreshToken")
      .populate("classroom");

    const studentDetails = students.map((student) => ({
      _id: student._id,
      name: student.name,
      email: student.email,
      classAssigned: student.classroom
        ? student.classroom.name
        : "Class not assigned",
    }));

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          studentDetails,
          "All students fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error while fetching all students details");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Cannot retrieve Users! Server error" });
  }
});

const removeStudentFromClass = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    const classroomId = user.classroom;

    const updateduser = await User.findByIdAndUpdate(
      userId,
      { $unset: { classroom: "" } },
      { new: true }
    );

    const updatedclass = await Classroom.findByIdAndUpdate(
      classroomId,
      { $pull: { students: userId } }, // Pull the userId from the students array
      { new: true }
    );
    if (!updatedclass) {
      throw new ApiError(
        409,
        "Classroom cannot be founded or student does not exist in class"
      );
    }

    res
      .status(200)
      .json(200, updatedclass, "Student successfully removed from classroom");
  } catch (error) {
    throw new ApiError(500, "Error while removing user from class", error);
  }
});

const deleteStudent = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await User.findById(studentId);
    if (!student) {
      throw new ApiError(400, "Student not found");
    }
    const classroomId = student.classroom;
    const deletedUser = await User.findByIdAndDelete(studentId);

    if (!deletedUser) {
      throw new ApiError(409, "Student cannot be delete");
    }

    if (classroomId) {
      await Classroom.findByIdAndUpdate(
        classroomId,
        { $pull: { students: studentId } }, // Pull the userId from the students array
        { new: true }
      );
    }

    res.status(200).json(200, deletedUser, "User deleted successfully");
  } catch (error) {
    throw new ApiError(500, "Error while deleting student");
  }
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;
  console.log("hi");

  console.log("teacher::", teacherId);

  // try {
  const teacher = await User.findById(teacherId);
  if (!teacher) {
    throw new ApiError(400, "Teacher not found");
  }
  const classroomId = teacher.classroom;
  const deletedUser = await User.findByIdAndDelete(teacherId);

  if (!deletedUser) {
    throw new ApiError(409, "Teacher cannot be delete");
  }

  if (classroomId) {
    await Classroom.findByIdAndUpdate(
      classroomId,
      { $unset: { teacher: "" } },
      { new: true }
    );
  }

  res.status(200).json(200, deletedUser, "User deleted successfully");
  // } catch (error) {
  //   throw new ApiError(500, "Error while deleting teacher");
  // }
});

module.exports = {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  getCurrentUser,
  logOutUser,
  teacherList,
  studentList,
  getAllUsers,
  removeStudentFromClass,
  deleteStudent,
  deleteTeacher,
};
