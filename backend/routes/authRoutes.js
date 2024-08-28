const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const {
  getCurrentUser,
  registerUser,
  loginUser,
  logOutUser,
} = require("../controllers/user.controller.js");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/me").get(authMiddleware, getCurrentUser);
router.route("/logout").post(authMiddleware, logOutUser);

module.exports = router;
