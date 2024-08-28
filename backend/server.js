const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const User = require("./models/user.models.js");

const authRoutes = require("./routes/authRoutes.js");
const classroomRoutes = require("./routes/classroomRoutes.js");
const timetableRoutes = require("./routes/timetableRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/classroom", classroomRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/user", userRoutes);

// Seed Principal User
// async function seedPrincipal() {
//   const principalEmail = "principal@classroom.com";
//   const principalPassword = "Admin";

//   let principal = await User.findOne({ email: principalEmail });

//   if (!principal) {
//     principal = new User({
//       name: "Principal",
//       email: principalEmail,
//       password: principalPassword,
//       role: "principal",
//     });

//     await principal.save();
//     console.log("Principal account created");
//   } else {
//     console.log("Principal account already exists");
//   }
// }

// seedPrincipal();

module.exports = { app };
