import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Student from "../assets/ai-student.png";
import Student2 from "../assets/ai-student-2.png";
import Student3 from "../assets/ai-student-3.png";
import Teacher from "../assets/ai-teacher.png";
import Teacher2 from "../assets/ai-teacher-2.png";

const Home = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="home">
      <div className="bg-hero min-h-screen bg-cover bg-center">
        <nav className="navbar px-4 w-full  flex align-center justify-between">
          <div className="navbar-brand box-border">
            <img
              className="box-border h-16 mix-blend-multiply"
              src="../classroom_logo.png"
            ></img>
          </div>
          <div className="actionButtons py-2 px-6 font-serif flex justify-between gap-4">
            <button
              onClick={handleLogin}
              className="text-blue-600 px-8 py-2 rounded-full bg-white"
            >
              {" "}
              Login
            </button>
            <button
              onClick={handleRegister}
              className="text-white px-8 py-2 rounded-full bg-teal-400"
            >
              {" "}
              Register
            </button>
          </div>
        </nav>

        <div className="permanent-marker-regular text-3xl text-white my-28 text-center pt-20">
          Welcome to your classroom
        </div>
      </div>

      <div className="bg-designclass bg-cover mx-10 mt-10">
        <div className="flex object-fit justify-between box-object">
          <img className="w-36 lg:w-72 h-auto hover:w-96" src={Student}></img>
          <img className="w-36 lg:w-72 h-auto box-object" src={Student2}></img>
          <img className="w-36 lg:w-72 h-auto" src={Student3}></img>
        </div>
        <div className="flex justify-evenly mt-4 p-10">
          <img className="w-36 lg:w-72 h-auto" src={Teacher}></img>
          <img className="w-36 lg:w-72 h-auto" src={Teacher2}></img>
        </div>
      </div>
    </div>
  );
};

export default Home;
