import { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/users";
import {
  allStudentInUserClassroom,
  getClassRoomDetails,
} from "../../services/classRoom";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState([]);
  const [classroom, setClassroom] = useState([]);
  const [classId, setClasssId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userResponse = await getCurrentUser();
        const response = userResponse.data.data;
        setUser(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const classroomId = user.classroom;

        //   setClassrooms(classroomId);
        if (classroomId) {
          const classroomResponse = await getClassRoomDetails(classroomId);
          if (!classroomResponse) {
            console.error("cannot fetch classroom response");
          }

          const classData = classroomResponse.data.data;
          setClasssId(classData._id);
          setClassroom([classData.name]);

          //   console.log("Class DAta:::", classData);

          const studentResponse = await allStudentInUserClassroom();
          setStudents(studentResponse.data.data);

          //   console.log("Student Response", studentResponse);
        } else {
          setClassroom(null);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [user]);

  const navigate = useNavigate();
  const handleTimetable = () => {
    navigate("/see-timetable-student");
  };
  const handleMore = async (classId) => {
    if (classId) {
      console.log("ClassID", classId);
      navigate(`/classprofile/${classId}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-col w-full items-center gap-2 p-2 mt-4 text-left">
      <div className="text-center font-bold uppercase text-lime-900 text-xl">
        Classroom
      </div>
      <div className="mt-4 relative w-full flex flex-col gap-4 bg-cyan-100 rounded-2xl p-4">
        <div>Class Name: {classroom}</div>
        <div className="actionButtons absolute top-4 right-3 flex gap-4">
          <button
            onClick={handleTimetable}
            className="rounded-full py-2 px-6 text-white bg-gradient-to-r from-indigo-500 from-10% via-pink-500 via-30% via-sky-500 via-40% to-emerald-500  ...  hover:text-black hover:px-5"
          >
            {" "}
            See Timetable{" "}
          </button>
          {/* <button
          "rounded-full p-2 text-white bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ...
            onClick={() => handleMore(classId)}
            className="rounded-full p-2 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ... "
          >
            {" "}
            View more{" "}
          </button> */}
        </div>
        <div>
          <h3>Your Classmates</h3>
          <table className="w-full ">
            <thead>
              <tr className="w-full flex justify-around">
                <th className="flex-1 text-center">Serial No.</th>
                <th className="flex-1 text-center">Name</th>
                <th className="flex-1 text-center">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id} className="w-full flex justify-around">
                  <td className="flex-1 flex items-center justify-center">
                    {index + 1}
                  </td>
                  <td className="flex-1 flex items-center justify-center">
                    {student.name}
                  </td>
                  <td className="flex-1 flex items-center justify-center">
                    {student.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
