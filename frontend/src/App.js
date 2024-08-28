import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dash";
import Timetable from "./components/timetable";
import Classroom from "./components/classroom";
import ClassroomList from "./components/classList";
import SeeTimetable from "./components/elements/seeTimetable";
import EditClass from "./components/elements/editClass.js";

import Log from "./components/elements/check.js";
import Home from "./pages/home.js";
import StudentList from "./pages/studentList.js";
import StudentTimetable from "./components/utils/seeStudentClassTimetable.js";
import Classprofile from "./components/utils/classProfile.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-timetable/:classroom" element={<Timetable />} />
          <Route path="/create-classroom" element={<Classroom />} />
          <Route path="/classroom" element={<ClassroomList />} />
          <Route path="/see-timetable" element={<SeeTimetable />} />
          <Route path="/see-timetable-student" element={<StudentTimetable />} />
          <Route path="/see-students" element={<StudentList />} />
          <Route path="/see" element={<Log />} />
          <Route path="/editclassroom/:id" element={<EditClass />} />
          <Route path="/classprofile/:id" element={<Classprofile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
