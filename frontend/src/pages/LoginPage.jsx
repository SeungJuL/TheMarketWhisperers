import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ✅ Success message state
  const [error, setError] = useState(""); // ✅ Error message state
  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");  // Clear messages before a new attempt
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8080/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (data.success) {
        localStorage.setItem("token", data.token);
        setMessage("Login Successful! Redirecting...");  // ✅ Show success message
        setTimeout(() => navigate("/profile"), 2000);  // Redirect after 2 seconds
      } else {
        setError(`Login failed! ${data.message}`);  // ✅ Show error message
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      
      {message && <p className="success-message">{message}</p>}  {/* ✅ Success message */}
      {error && <p className="error-message">{error}</p>}  {/* ✅ Error message */}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;