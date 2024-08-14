import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/timetable.css";

const Timetable = () => {
  const [classroomName, setClassroomName] = useState("");
  const [numLectures, setNumLectures] = useState(1);
  const [lectures, setLectures] = useState([
    { name: "", startTime: "", endTime: "", teacher: "" },
  ]);
  //   const [teachers, setTeachers] = useState([]);

  const navigate = useNavigate();

  //   useEffect(() => {
  //     const fetchTeachers = async () => {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get("/api/teachers", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setTeachers(response.data);
  //     };

  //     fetchTeachers();
  //   }, []);

  const handleNumLecturesChange = (e) => {
    const number = parseInt(e.target.value, 10);
    setNumLectures(number);
    const newLectures = [];
    for (let i = 0; i < number; i++) {
      newLectures.push({ name: "", startTime: "", endTime: "", teacher: "" });
    }
    setLectures(newLectures);
  };

  const handleLectureChange = (index, field, value) => {
    const newLectures = [...lectures];
    newLectures[index][field] = value;
    setLectures(newLectures);
  };

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/timetable/create",
        { classroomName, lectures },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.alert("Time Table Created Successfully!");
      navigate("/dashboard"); // Navigate back to dashboard after successful creation
    } catch (error) {
      console.error("Error creating timetable", error);
    }
  };

  return (
    <div className="timetable">
      <h2>Create Timetable</h2>
      <form className="timetable-form" onSubmit={handleCreateTimetable}>
        <div className="timetable-class">
          <label>Class Name:</label>
          <input
            type="text"
            value={classroomName}
            onChange={(e) => setClassroomName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>No. of Lectures:</label>
          <input
            type="number"
            value={numLectures}
            onChange={handleNumLecturesChange}
            min="1"
            required
          />
        </div>
        {lectures.map((lecture, index) => (
          <div className="lecture" key={index}>
            <h4>Lecture {index + 1}</h4>
            <input
              type="text"
              placeholder="Name"
              value={lecture.name}
              onChange={(e) =>
                handleLectureChange(index, "name", e.target.value)
              }
              required
            />
            <input
              type="time"
              placeholder="Start Time"
              value={lecture.startTime}
              onChange={(e) =>
                handleLectureChange(index, "startTime", e.target.value)
              }
              required
            />
            <input
              type="time"
              placeholder="End Time"
              value={lecture.endTime}
              onChange={(e) =>
                handleLectureChange(index, "endTime", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Teacher"
              value={lecture.teacher}
              onChange={(e) =>
                handleLectureChange(index, "teacher", e.target.value)
              }
              required
            />
            {/* <select
              value={lectures[index]?.teacher || ""}
              onChange={(e) =>
                handleLectureChange(index, "teacher", e.target.value)
              }
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select> */}
          </div>
        ))}
        <button type="submit">Create Timetable</button>
      </form>
    </div>
  );
};

export default Timetable;
