const User = require("../models/user.models.js");
const { ApiError } = require("../utils/ApiError.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
// const authMiddleware = require("./authMiddleware.js");

const adminCheck = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "principal") {
      throw new ApiError(403, "You are not authorized to access this route");
    }

    req.user = user;
    next();
  } catch (error) {
    // next(error);
    throw new ApiError(400, "Unable to process adminCheck");
  }
});

const TeacherCheck = asyncHandler(async (req, _, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!(user.role === "teacher" || user.role === "principal")) {
      throw new ApiError(403, "You are not authorized to access this route");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, "Unable to process adminCheck");
  }
});

module.exports = { adminCheck, TeacherCheck };
