import React, { useState } from "react";
import { login } from "../services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);

      // store in localstorage
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      alert("Login Successful! Token stored");
      console.log("Received", data);
    } catch (error) {
      alert(
        "Login Failed: " + (error.response?.data?.detail || "Unknown error"),
      );
    }
  };

  return (
    <div>
      <h2>Login Test</h2>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="">Password:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  )
};

export default Login;