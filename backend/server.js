const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const User = require("./models/user.models.js");
const Classroom = require("./models/classroom.models.js");
const Timetable = require("./models/timetable.models.js");

const authRoutes = require("./routes/authRoutes.js");
const classroomRoutes = require("./routes/classroomRoutes.js");
const timetableRoutes = require("./routes/timetableRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const app = express();
dotenv.config();
// require("dotenv").config({ path: "../env" });

const PORT = process.env.PORT;
const connectDB = require("./db/index.js");

app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 7000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo db connection failed!", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/classroom", classroomRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/user", userRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// Seed Principal User
async function seedPrincipal() {
  const principalEmail = "principal@classroom.com";
  const principalPassword = "Admin";

  let principal = await User.findOne({ email: principalEmail });

  if (!principal) {
    principal = new User({
      name: "Principal",
      email: principalEmail,
      password: principalPassword,
      role: "principal",
    });

    await principal.save();
    console.log("Principal account created");
  } else {
    console.log("Principal account already exists");
  }
}

seedPrincipal();
