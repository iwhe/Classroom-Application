import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/dash.css";
import PrincipalDashboard from "./elements/principalDashboard";
import TeacherDashboard from "./elements/teacherDashoard.js";
import { getAllUsers, getCurrentUser, logOutUser } from "../services/users.js";
import { classroomLists } from "../services/classRoom.js";
import StudentDashboard from "./elements/studentDashboard.js";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userResponse = await getCurrentUser();
        setUser(userResponse.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  //Handle Delete Users
  //   const handleDelete = async (userId) => {
  //     try {
  //       const token = localStorage.getItem("token"); // Assuming you need token for authorization
  //       await axios.delete(`/api/users/${userId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       // Refresh data after deletion
  //       setTeachers(teachers.filter((teacher) => teacher._id !== userId));
  //       setStudents(students.filter((student) => student._id !== userId));
  //       window.alert("User deleted successfully! ");
  //     } catch (error) {
  //       console.error("Error deleting user", error);
  //     }
  //   };

  const handleLogout = async () => {
    try {
      await logOutUser();
      navigate("/login");
      console.log("User logged out successfully"); // Redirect to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle case where user data is not available
  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="w-full flex align-center justify-center">
      <div className="dashboard flex flex-col align-center justify-center  w-full md:w-9/12">
        <div className="logout">
          <button
            className="logoutButton px-6 py-2 rounded-full hover:bg-slate-400 hover:text-red-500"
            onClick={handleLogout}
          >
            Log Out{" "}
          </button>
        </div>

        <h2 className=" mt-4 text-xl md:mt-0 uppercase text-left md:text-center font-bold p-4 bg-gradient-to-r from-amber-800 via-blue-700 to-rose-900 bg-clip-text text-transparent">
          Welcome to your Classroom Account
        </h2>
        <div className="userDetails relative w-full">
          <h3 className="uppercase font-serif border-b border-gray-400 text-gray-600">
            User Detail
          </h3>
          <div className="mx-4 py-4">
            <p>
              Username: <span className="mx-1 font-medium">{user.name}</span>
            </p>
            <p>
              Email: <span className="mx-9 font-medium">{user.email} </span>
            </p>
            <p>
              Role: <span className="mx-11 font-medium">{user.role} </span>
            </p>
          </div>
        </div>

        {user.role === "principal" && <PrincipalDashboard />}

        {user.role === "teacher" && <TeacherDashboard />}

        {user.role === "student" && <StudentDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
