import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from '../components/PageWrapper';

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
    <PageWrapper>
      <div className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        {message && <p className="success-message text-green-500 mb-4">{message}</p>}
        {error && <p className="error-message text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-sm p-2 mb-4 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full max-w-sm p-2 mb-4 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleLogin}
          className="w-full max-w-sm p-2 bg-slate-900 hover:bg-blue-800 rounded text-white font-semibold"
        >
          Login
        </button>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;