import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/classroom.css";

const CreateClassroom = () => {
  const [className, setClassName] = useState("");
  const [assignedTeacher, setAssignedTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  //   const [assignedStudents, setAssignedStudents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch available teachers
        const teacherResponse = await axios.get("/api/user/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const studentResponse = await axios.get("/api/user/students", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter out teachers already assigned to a classroom
        const availableTeachers = teacherResponse.data.filter(
          (teacher) => !teacher.classroom
        );
        setTeachers(availableTeachers);
        setStudents(studentResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/classroom/create",
        { className, assignedTeacher, selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Handle success
      window.alert("Classroom Created Successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating classroom", error);
    }
  };

  const handleStudentChange = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  return (
    <div className="create-classroom">
      <h2>Create Classroom</h2>
      <form className="create-classForm" onSubmit={handleCreateClassroom}>
        <div className="classroom-name">
          <label>Classroom Name:</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Classroom Name"
            required
          />
        </div>
        <div className="class-teacher">
          <label>Select Teacher to assign this class:</label>
          <select
            value={assignedTeacher}
            onChange={(e) => setAssignedTeacher(e.target.value)}
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
        <div className="class-students">
          <h3>Select Students</h3>
          <ul>
            {students.map((student) => (
              <li key={student._id}>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student._id)}
                  onChange={() => handleStudentChange(student._id)}
                />
                {student.name} ({student.email})
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Create Classroom</button>
      </form>
    </div>
  );
};

export default CreateClassroom;
