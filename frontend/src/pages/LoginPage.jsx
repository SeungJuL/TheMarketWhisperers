import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from '../components/PageWrapper';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ✅ Success message state
  const [error, setError] = useState(""); // ✅ Error message state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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
        setTimeout(() => navigate("/"), 2000);  // Redirect after 2 seconds
      } else {
        setError(`Login failed! ${data.message}`);  // ✅ Show error message
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Failed to connect to the server.");
    }
  };

  return (

    <div class="min-h-screen bg-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Login
        </h2>

        <p class="mt-2 text-center text-sm text-white max-w">
          Or
          <a href="/signup" class="font-medium text-blue-600 hover:text-blue-500"> create an account</a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

        {message && <p className="success-message text-green-500 mb-4">{message}</p>}  {/* ✅ Success message */}
        {error && <p className="error-message text-red-500 mb-4">{error}</p>}  {/* ✅ Error message */}

        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          <form class="space-y-6" action="#" method="POST">
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <div class="mt-1">
                <input id="email" name="email" type="email" autocomplete="email" required placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)}
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"></input>
              </div>
            </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1">
                  <input id="password" name="password" type="password" autocomplete="current-password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                  class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"></input>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"></input>
                  <label for="remember_me" class="ml-2 block text-sm text-gray-900">Remember Me</label>
                </div>

                <div class="text-sm">
                  <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
                </div>
              </div>

              <div>
                <button onClick={handleLogin} type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Login
                </button>
              </div>
          </form>

          <div class="mt-6">

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>

              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-gray-100 test-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-3 gap-3">
              <div>
                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <img class="h-5 w-5" src="https://www.svgrepo.com/show/512120/facebook-176.svg" alt=""></img>
                </a>
              </div>

              <div>
                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <img class="h-5 w-5" src="https://www.svgrepo.com/show/513008/twitter-154.svg" alt=""></img>
                </a>
              </div>

              <div>
                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <img class="h-6 w-6" src="https://www.svgrepo.com/show/506498/google.svg" alt=""></img>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;