import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./check.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import { getClassRoomDetails, updateClass } from "../../services/classRoom";
import { getAllStudents, getAllTeachers } from "../../services/users";

const EditClass = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  const [value, setValues] = useState({
    classname: "",
    description: "",
    assignedTeacher: null,
    selectedStudents: [],
  });

  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);

      try {
        const response = await getClassRoomDetails(id);
        setClassrooms(response.data.data);
        console.log("resp--", response);
      } catch (err) {
        setError("Error fetching classrooms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [id]);

  useEffect(() => {
    setValues({
      ...value,
      classname: classrooms.name,
      description: classrooms.description,
      assignedTeacher: classrooms.teacher,
      selectedStudents: classrooms.students,
    });
  }, [classrooms]);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const studentResponse = await getAllStudents();
        const allstudents = studentResponse.data.data;
        setStudents(allstudents);

        const teacherResponse = await getAllTeachers();
        const allteachers = teacherResponse.data.data;
        setTeachers(allteachers);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const notSelectedStud = students.filter(
    (student) => !value.selectedStudents?.includes(student._id)
  );

  const notAssignedTeacher = teachers.filter(
    (teacher) => teacher._id !== value.assignedTeacher
  );

  const handleInputChange = (e) => {
    setValues({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleTeacherChange = (e) => {
    const newTeacherId = e.target.value;
    setValues((prevValues) => ({
      ...prevValues,
      assignedTeacher: newTeacherId,
    }));
  };

  const handleChange = (studentId) => {
    setTimeout(() => {
      setValues((prev) => ({
        ...prev,
        selectedStudents: prev.selectedStudents.includes(studentId)
          ? prev.selectedStudents.filter((id) => id !== studentId)
          : [...prev.selectedStudents, studentId],
      }));
    }, 1000);
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const classname = value.classname;
      const description = value.description;
      const assignedTeacher = value.assignedTeacher;
      const selectedStudents = value.selectedStudents;

      const updatedResponse = await updateClass(id, {
        classname,
        description,
        assignedTeacher,
        selectedStudents,
      });
      console.log(updatedResponse.data);
      console.log("updated successfully");
      alert(`Classroom  edited successfully!`);
      navigate("/classroom");
    } catch (error) {
      // Handle any errors that occur during the request
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError("Validation Error: Classroom not found");
            break;
          case 404:
            setError("Not found: Teacher not found!");
            break;
          case 409:
            setError("Teacher has already been assigned to a different class");
            break;
          case 500:
            setError("Server Error: Error updating timetable");
            break;
          default:
            setError("Server Error: An unexpected error occurred");
            break;
        }
      } else {
        setError("Network Error: Unable to reach server");
      }
    } finally {
      setLoading(false);
      // if (!error.response || error.response.status !== 500) {

      // }
    }
  };

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <div>
      <div className="popup">
        {error && (
          <div className="errorContainer">
            {" "}
            <p style={{ color: "red" }}> {error}</p>
          </div>
        )}

        <div className="popup-inner">
          <FontAwesomeIcon
            onClick={() => navigate("/classroom")}
            style={{ color: "red", position: "absolute", right: "10px" }}
            icon={faCircleXmark}
          />
          <h3
            style={{
              textAlign: "center",
              color: " rgba(232, 138, 38, 1)",
              textTransform: "uppercase",
            }}
          >
            Edit Class
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="className">
              <label> Class Name:</label>

              <input
                type="text"
                className="ClassNameInput"
                name="classname"
                value={value.classname}
                onChange={handleInputChange}
              />
            </div>
            <div className="description">
              <label> Description:</label>

              <textarea
                type="text"
                className="descriptionInput"
                name="description"
                value={value.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="teacher">
              <label>
                Assign Teacher
                <select
                  className="teacherInput"
                  value={value.assignedTeacher}
                  onChange={(e) => handleTeacherChange(e)}
                >
                  {value.assignedTeacher &&
                    !notAssignedTeacher.some(
                      (teacher) => teacher._id === value.assignedTeacher
                    ) && (
                      <option
                        className="teacherInput"
                        value={value.assignedTeacher}
                      >
                        {teachers.find(
                          (teacher) => teacher._id === value.assignedTeacher
                        )?.name || "Select Teacher"}
                      </option>
                    )}
                  {notAssignedTeacher.map((teacher) => (
                    <option
                      className="teacherInput"
                      key={teacher._id}
                      value={teacher._id}
                    >
                      {teacher.name}
                    </option>
                  ))}
                  <option className="teacherInput" value="none">
                    I'll assign later
                  </option>
                </select>
              </label>
            </div>

            <div className="students">
              <label>
                Add or remove students
                <div className="studentList">
                  {students.map((student) => (
                    <div className="studentElement" key={student._id}>
                      <input
                        type="checkbox"
                        checked={value.selectedStudents?.includes(student._id)}
                        onChange={() => handleChange(student._id)}
                      />
                      {student.name}
                    </div>
                  ))}
                </div>
              </label>
            </div>
            <button type="submit">Save Edit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClass;
