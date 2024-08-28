// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/user.models.js");
const { ApiError } = require("../utils/ApiError.js");

const authMiddleware = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (
      !user
      // || (user.role.length && !role.includes(user.role))
    ) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    console.log("Auth Middleware execution success!");
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token");
  }
});

module.exports = authMiddleware;
