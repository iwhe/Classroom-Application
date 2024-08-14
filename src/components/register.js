// src/components/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

const APP_API_URL = "http://localhost:7000" || process.env.REACT_APP_API_URL;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${APP_API_URL}/api/auth/register`, {
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
    <div className="register">
      <div className="register-section">
        <h2>Register</h2>
        <form className="registerForm" onSubmit={handleSubmit}>
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
      <div className="login-section">
        <p>Already an user?</p>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Register;
