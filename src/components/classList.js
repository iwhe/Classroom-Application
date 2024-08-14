import React, { useEffect, useState } from "react";
import axios from "axios";

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get("/api/classroom");
        setClassrooms(response.data);
      } catch (err) {
        setError("Error fetching classrooms");
        console.error(err);
      }
    };

    fetchClassrooms();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/classroom/${id}`);
      setClassrooms(classrooms.filter((classroom) => classroom._id !== id));
    } catch (err) {
      setError("Error deleting classroom");
      console.error(err);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Classroom List</h2>
      <table>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Teacher</th>
            <th>Students</th>
            <th>Actions</th> {/* Add a header for actions */}
          </tr>
        </thead>
        <tbody>
          {classrooms.map((classroom) => (
            <tr key={classroom._id}>
              <td>{classroom.name}</td>
              <td>
                {classroom.teacher ? (
                  <span>
                    {classroom.teacher.name} ({classroom.teacher.email})
                  </span>
                ) : (
                  "No Teacher Assigned"
                )}
              </td>
              <td>
                {classroom.students.length > 0 ? (
                  <ul>
                    {classroom.students.map((student) => (
                      <li key={student._id}>
                        {student.name} ({student.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No Students Assigned"
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(classroom._id)}>
                  Delete
                </button>{" "}
                {/* Add delete button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassroomList;
