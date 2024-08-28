import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";
import Education from "../assets/education.png";
import { handleRegister } from "../services/users";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister({
        name,
        email,
        password,
        role,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error registering", error);
    }
  };

  const handleLogin = async (e) => {
    navigate("/login");
  };

  return (
    <div className="wrapper pt-20 max-h-screen flex justify-around bg-white">
      <div onClick={() => navigate("/")} className="title">
        <img
          style={{
            width: "70px",
            position: "absolute",
            left: "20px",
            top: "20px",
            borderRadius: "10px",
          }}
          src="../classroom_logo.png"
          alt="Classroom Application Logo"
        ></img>
      </div>
      <div className="register flex justify-center align-center">
        <div className="register-section">
          {/* <h2>Welcome to Classroom Application for all! </h2>
            <h3>You can manage all your classroom related task here.</h3> */}

          <form className="registerForm" onSubmit={handleSubmit}>
            <h3 className="text-blue-300 font-bold capitalize">
              Register yourself
            </h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <button type="submit">Register</button>
          </form>
        </div>
        <div className="w-full mt-10 login-section">
          <p className=" text-center">Already an user?</p>
          <button className="w-full" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>

      <div className="md:shrink-0 hidden sm:flex items-center">
        <img
          className="w-48 item-center md:w-64 lg:w-full lg:h-screen object cover"
          src={Education}
        ></img>
      </div>
    </div>
  );
};

export default Register;
