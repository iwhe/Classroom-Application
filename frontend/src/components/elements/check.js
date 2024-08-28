import React, { useState } from "react";
import "./check.css";
import Login from "./check2.js";

export default function Log() {
  const [seen, setSeen] = useState(false);

  function togglePop() {
    setSeen(!seen);
  }

  return (
    <div>
      <button onClick={togglePop}>Login</button>
      {seen ? <Login toggle={togglePop} /> : null}
    </div>
  );
}
