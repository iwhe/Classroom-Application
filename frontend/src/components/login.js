// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";
import quote1 from "../assets/Thomas-Edison-Genius-Perspiration.png";
import quote2 from "../assets/albert-einstein-quote.png";
import { handleLogin } from "../services/users";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await handleLogin({
        email,
        password,
      });
      console.log(`User logged in!`);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      switch (err.response?.status) {
        case 400:
          setError("Bad Request: Please check your input.");
          break;
        case 401:
          setError("Unauthorized: Invalid password");
          break;
        case 404:
          setError("Not Found: User not found");
          break;
        case 500:
          setError("Server Error: Please try again later.");
          break;
        default:
          setError("An unknown error occurred.");
      }
    }
  };

if(loading){
 return <div>Please wait for some time.. Fetching API for the first time might take some time 
</div>
}

  return (
    <div className="login-container justify-around items-center min-h-screen md:flex">
      <div className="login w-full">
        <form
          className="loginForm h-72 mt-6 flex justify-between"
          onSubmit={handleSubmit}
        >
          <h2 className="text-blue-500 uppercase font-bold">Login</h2>
          <div className="flex justify-between">
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
          </div>
          {error && <p className="text-rose-600">{error}</p>}
          <button type="submit">Login</button>
        </form>

        <div className="mt-10">
          <p>Don't have an account?</p>
          <button
            className="bg-green-600 text-white 
            p-4 rounded-full w-full"
            onClick={() => navigate("/register")}
          >
            {" "}
            Register{" "}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-b from-yellow-50 from-20% via-yellow-600 via-50% to-emerald-50 to-90% ... w-full h-screen quotes flex items-center justify-evenly md:bg-gradient-to-l from-yellow-50 from-20% via-yellow-600 via-50% to-emerald-50 to-90% ... w-full h-screen quotes flex items-center justify-evenly">
        <img
          className="w-48 mb-52 top-2.5 border-yellow-600 border-4 border-double"
          src={quote1}
        ></img>

        <img
          className="w-48 mt-52 border-yellow-600 border-4 border-double"
          src={quote2}
        ></img>
      </div>
    </div>
  );
};

export default Login;
