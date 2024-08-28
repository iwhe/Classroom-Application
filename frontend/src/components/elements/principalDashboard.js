import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteStudent,
  deleteTeacher,
  getAllStudents,
  getAllTeachers,
} from "../../services/users";

const PrincipalDashboard = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentsData = await getAllStudents();
        setStudents(studentsData.data.data);

        const teacherData = await getAllTeachers();
        setTeachers(teacherData.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteTeacher = async (id) => {
    try {
      const response = await deleteTeacher(id);
      if (response) {
        alert("Teacher deleted successfully");

        setTeachers((prevTeachers) =>
          prevTeachers.filter((teacher) => teacher._id !== id)
        );
      }
    } catch (error) {
      console.log("Error deleting teacher", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      const response = await deleteStudent(id);
      if (response) {
        alert("Student deleted successfully");
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== id)
        );
      }
    } catch (error) {
      console.log("Error deleting student", error);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      <div className="classroomButtons">
        <button className="seeClassroom" onClick={() => navigate("/classroom")}>
          See all Classrooms
        </button>

        <button
          className="createClassroom"
          onClick={() => navigate("/create-classroom")}
        >
          Create Classroom
        </button>
      </div>
      <div className="userList">
        <div>
          <h3>Teachers</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr className="tableEntry" key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <button onClick={() => handleDeleteTeacher(teacher._id)}>
                      Delete
                    </button>
                  </td>
                  {/* <td>Add Edit/Delete Actions</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Students</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <button onClick={() => handleDeleteStudent(student._id)}>
                      Delete
                    </button>
                  </td>
                  {/* <td>Add Edit/Delete Actions</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
