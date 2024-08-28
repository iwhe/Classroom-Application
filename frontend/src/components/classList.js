import React, { useEffect, useState } from "react";
import "./styles/classList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditClass from "./elements/editClass.js";
import { useNavigate } from "react-router-dom";
import { classroomLists, deleteClassroom } from "../services/classRoom.js";

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        const response = await classroomLists();
        setClassrooms(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching classrooms");
        console.error(err);
      }
    };

    fetchClassrooms();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteClassroom(id);
      setClassrooms(classrooms.filter((classroom) => classroom._id !== id));
      setLoading(false);
    } catch (err) {
      setError("Error deleting classroom");
      console.error(err);
    }
  };

  const navigate = useNavigate();
  const handleEdit = async (id) => {
    navigate(`/editclassroom/${id}`);
    // setEditId(id);
    // console.log(id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) return <div>{error}</div>;

  return (
    <div className="classList">
      <h2>Classroom List</h2>

      <div className="ListWrapper">
        {classrooms.length == 0 && <div>No classrooms found</div>}
        {classrooms.map((classroom) => (
          <div className="listItem" key={classroom._id}>
            <div className="class-name">
              {" "}
              <p>Class Name:</p> {classroom.name}{" "}
              <div
                style={{ color: "cyan" }}
                className="icon1"
                onClick={() => handleEdit(classroom._id)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </div>
              <div
                style={{ color: "red" }}
                className="icon2"
                onClick={() => handleDelete(classroom._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>

            <div className="class-teacher">
              {" "}
              <p>Teacher assigned to this class: </p>
              {classroom.teacher ? (
                <span>
                  {classroom.teacher.name}
                  {/* ({classroom.teacher.email}) */}
                </span>
              ) : (
                "No Teacher Assigned"
              )}
            </div>

            <div className="class-description">
              {" "}
              <p>Description</p> {classroom.description}{" "}
            </div>

            <div className="class-students">
              <p> Students in this Classroom</p>
              <div className="stuListHeading">
                <div> Student Name </div>
                <div> Student Email </div>
              </div>
              {classroom.students.length > 0 ? (
                <div className="stuList">
                  {classroom.students.map((student) => (
                    <div className="stuItem" key={student._id}>
                      <div className="stuName">{student.name}</div>
                      <div className="stuEmail">({student.email})</div>
                    </div>
                  ))}
                </div>
              ) : (
                "No Students Assigned"
              )}
            </div>
          </div>
        ))}

        {editId && <EditClass id={editId} />}
      </div>
    </div>
  );
};

export default ClassroomList;
