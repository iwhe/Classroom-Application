import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/classroom.css";
import { getAllStudents, getAllTeachers } from "../services/users";
import { createClassroom } from "../services/classRoom";

const CreateClassroom = () => {
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTeacher, setAssignedTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherResponse = await getAllTeachers();
        const teachers = teacherResponse.data.data;

        const studentResponse = await getAllStudents();
        const student = studentResponse.data.data;

        const availableTeachers = teachers.filter(
          (teacher) => !teacher.classroom
        );

        setTeachers(availableTeachers);
        setStudents(student);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      await createClassroom({
        className,
        assignedTeacher,
        selectedStudents,
        description,
      });

      // Handle success
      window.alert("Classroom Created Successfully!");
      navigate("/dashboard");
    } catch (error) {
      if (error.response) console.error("Error creating classroom", error);
    }
  };

  const handleStudentChange = async (e, studentId) => {
    if (e.target.checked) {
      setSelectedStudents((prevSelected) => [...prevSelected, studentId]);
    } else {
      setSelectedStudents((prevSelected) =>
        prevSelected.filter((id) => id !== studentId)
      );
    }
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
        <div className="classroom-description">
          <label>Classroom Description:</label>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description about this class here"
            required
          />
        </div>
        <div className="class-teacher">
          <label>Select available teacher to assign this class:</label>
          <select
            value={assignedTeacher}
            onChange={(e) => setAssignedTeacher(e.target.value)}
            required
          >
            <option value="">Select Teacher</option>
            <option value="none">I'll assign later</option>
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
                  value={student._id}
                  // checked={selectedStudents.includes(student._id)}
                  onChange={(e) => handleStudentChange(e, student._id)}
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
