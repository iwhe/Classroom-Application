import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, removeUserFromClass } from "../../services/users";
import {
  allStudentInUserClassroom,
  getClassRoomDetails,
} from "../../services/classRoom";
// import "./styles/dash.css";

const TeacherDashboard = () => {
  const [user, setUser] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await getCurrentUser();

        if (!userResponse) {
          setError("Unable to user response from server");
        }
        setUser(userResponse.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroomId = user.classroom;

        //   setClassrooms(classroomId);
        if (classroomId) {
          const classroomResponse = await getClassRoomDetails(classroomId);
          if (!classroomResponse) {
            console.error("cannot fetch classroom response");
          }

          const classroom = classroomResponse.data.data;
          setClassrooms([classroom.name]);

          const studentResponse = await allStudentInUserClassroom();
          setStudents(studentResponse.data.data);
        } else {
          setClassrooms(null);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleRemove = async (id) => {
    try {
      setLoading(true);
      console.log(id);

      const remove = await removeUserFromClass(id);

      if (remove) {
        alert("Student removed successfully from classroom");
        setStudents(students.filter((student) => student.id !== id));
        console.log("Students ::", students);
      }
    } catch (error) {
      console.log("Error removing student from class", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle case where user data is not available
  if (!user) {
    return <div>{error}</div>;
  }

  if (!classrooms) {
    return (
      <div>
        <p style={{ color: "red" }}>
          You have not been assigned to a classroom yet. Contact your principal
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full mt-6">
      <h2 className="text-center border-b border-gray-800 text-yellow-600 uppercase font-bold">
        Your Classroom
      </h2>

      <div className=" relative w-full overflow-x-auto flex flex-col  justify-start items-start ">
        <h3>Class: {classrooms}</h3>
        <h3 className="mt-8 md:mt-4 text-indigo-600 uppercase font-bold">
          Students in your Classroom
        </h3>

        {students.length > 0 ? (
          <div className="w-full">
            <p>No. of Students Admitted to this class: {students.length}</p>
            <table className="min-w-full bg-white mt-4">
              <thead>
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left  text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Serial No.
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student._id}>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td
                      className=" px-3 md:px-6 py-3 text-red-500 hover:text-black pointer-events-auto cursor-pointer"
                      onClick={() => handleRemove(student._id)}
                    >
                      Remove from class
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-yellow-500 ">No students available.</p>
        )}
      </div>

      <div className=" mt-4 timetableButtons flex flex-col md:flex-row gap-2  absolute right-0 md:right-4 top-4">
        <button
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-1 md:p-4 rounded-full md:rounded-full font-bold text-white hover:text-black hover:bg-white"
          onClick={() => navigate("/see-timetable")}
        >
          Timetable for this class
        </button>
        <button
          className="bg-blue-500 px-2 py-1 md:p-4 rounded-2xl text-white"
          onClick={() => navigate(`/create-timetable/${classrooms}`)}
        >
          Create New Timetable
        </button>
      </div>

      <div className="seeUsers mt-4">
        <button
          className="bg-teal-400 p-4 rounded-2xl"
          onClick={() => navigate("/see-students")}
        >
          See all students in school
        </button>
        <div className="principal"></div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
