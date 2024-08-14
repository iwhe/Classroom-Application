const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");

// Register a new user
router.post(
  "/register",
  //   authMiddleware(["principal", "teacher"]),
  async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create a new user instance
      user = new User({
        name,
        email,
        password,
        role,
      });

      // Save the user to the database (password will be hashed automatically)
      await user.save();

      // Return success message
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate the password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Return the token
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// /me route to get the currently authenticated user's information
router.get("/me", authMiddleware(), async (req, res) => {
  try {
    // req.user is already set by the authMiddleware
    res.json(req.user); // Respond with user data, excluding password
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
