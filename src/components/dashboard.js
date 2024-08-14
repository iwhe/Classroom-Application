// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
          navigate("/login");
          return;
        }

        const userResponse = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
        console.log(userResponse.data);

        if (userResponse.data.role === "principal") {
          const classroomResponse = await axios.get("/api/classroom", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClassrooms(classroomResponse.data);

          const userResponse = await axios.get("/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStudents(userResponse.data.filter((u) => u.role === "student"));
          setTeachers(userResponse.data.filter((u) => u.role === "teacher"));
        } else if (userResponse.data.role === "teacher") {
          const classroomId = userResponse.data.classroom;
          if (classroomId) {
            const classroomResponse = await axios.get(
              `/api/classroom/${classroomId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setClassrooms([classroomResponse.data]);

            const studentResponse = await axios.get(
              `/api/user/classroom/${classroomId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setStudents(studentResponse.data);
          } else {
            // Teacher has not been assigned a classroom
            setClassrooms(null);
          }
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [navigate]);

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h2>Welcome to your Classroom Account</h2>

      {user && user.role === "principal" && (
        <>
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
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{/* Add Edit/Delete Actions */}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
                  <td>{/* Add Edit/Delete Actions */}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => navigate("/create-classroom")}>
            Create Classroom
          </button>
        </>
      )}

      {user.role === "teacher" && classrooms === null && (
        <p>You have not been assigned to a classroom yet.</p>
      )}

      {user.role === "teacher" && classrooms !== null && (
        <div>
          <div className="userDetails">
            <h3>User Detail:</h3>
            {/* <p>Username: {user.name}</p>
            <p>Email: {user.email} </p>
            <p>Role: {user.role} </p> */}
          </div>
          <h2>Your Classroom</h2>
          {classrooms.length > 0 &&
            classrooms.map((classroom) => (
              <div key={classroom._id}>
                <h3>{classroom.name}</h3>
                <h3>Students in your Classroom</h3>
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
                        <td>{/* Add Edit/Delete Actions */}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

          <button onClick={() => navigate("/create-timetable")}>
            Create Timetable
          </button>
        </div>
      )}

      {user && user.role === "student" && (
        <>
          <h3>Other Students in Your Classroom</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Dashboard;
