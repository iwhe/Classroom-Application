import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dash";
import Timetable from "./components/timetable";
import Classroom from "./components/classroom";
import ClassroomList from "./components/classList";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-timetable" element={<Timetable />} />
          <Route path="/create-classroom" element={<Classroom />} />
          <Route path="/classroom" element={<ClassroomList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
