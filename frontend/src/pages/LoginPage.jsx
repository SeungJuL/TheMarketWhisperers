import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { fetchUserProfile } from "../utils/userUtils";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const userProfile = await fetchUserProfile();
        setUser(userProfile); // Update user state with profile data
        setMessage("Login Successful! Redirecting...");
        setTimeout(() => navigate(`/dashboard?stock=${userProfile.asset_symbol}`), 2000); // Redirect with asset symbol
      } else {
        const errorData = await response.json();
        setError(`Login failed! ${errorData.message}`);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Failed to connect to the server.");
    }
  };

  return (
    <PageWrapper>
      {/* Outer container with background image */}
      <div className="relative min-h-screen w-full flex flex-col">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `
        linear-gradient(
          rgba(15, 23, 42, 0.85), 
          rgba(15, 23, 42, 0.85)
        ), 
        url("/backgroundhome.png")
      `,
            backgroundBlendMode: "overlay",
            // Optionally, you can remove the filter brightness
            // if the gradient already darkens it enough:
            // filter: "brightness(0.4)",
          }}
        />
        {/* Content container */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Login Card */}
          <div className="max-w-md w-full bg-opacity-0 backdrop-blur-lg rounded-2xl shadow-md p-8 border border-white/20 text-white">
            <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

            {/* Success / Error Messages */}
            {message && (
              <p className="text-green-500 mb-4 text-center">{message}</p>
            )}
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field + Icon */}
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full p-4 pr-10
                    bg-transparent
                    border border-white/20
                    text-white
                    placeholder-slate-300
                    rounded-lg
                    focus:outline-none
                    focus:ring-1 focus:ring-white
                  "
                />
                {/* Envelope SVG Icon */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-slate-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 
                        2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 
                        19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 
                        2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 
                        8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
              </div>

              {/* Password Field + Icon */}
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full p-4 pr-10
                    bg-transparent
                    border border-white/20
                    text-white
                    placeholder-slate-300
                    rounded-lg
                    focus:outline-none
                    focus:ring-1 focus:ring-white
                  "
                />
                {/* Lock SVG Icon */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-slate-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 
                        11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 
                        2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 
                        2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </div>
              </div>

              {/* Remember Me / Forgot Password */}
              <div className="flex items-center justify-between mt-5">
                <label className="flex items-center text-sm text-slate-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                  />
                  Remember Me
                </label>
                <a href="#" className="text-sm text-white-400 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="
                  w-full py-3
                  bg-white/80 hover:bg-white
                  border border-black/20
                  rounded-lg
                  text-black font-semibold
                  transition-colors
                "
              >
                Login
              </button>
            </form>

            {/* Social Logins */}
            <div className="mt-8">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 border-t border-slate-500 opacity-50" />
                <span className="bg-transparent px-2 text-sm text-slate-300 z-10 mt-3">
                  Or continue with
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {/* Facebook */}
                <a
                  href="#"
                  className="
                    flex items-center justify-center
                    px-4 py-2
                    bg-white/80 hover:bg-white
                    border border-white/20
                    rounded-lg
                    shadow-sm
                    text-white
                    transition-colors
                  "
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/512120/facebook-176.svg"
                    alt="facebook"
                  />
                </a>
                {/* Twitter */}
                <a
                  href="#"
                  className="
                    flex items-center justify-center
                    px-4 py-2
                    bg-white/80 hover:bg-white
                    border border-white/20
                    rounded-lg
                    shadow-sm
                    text-white
                    transition-colors
                  "
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/513008/twitter-154.svg"
                    alt="twitter"
                  />
                </a>
                {/* Google */}
                <a
                  href="#"
                  className="
                    flex items-center justify-center
                    px-4 py-2
                    bg-white/80 hover:bg-white
                    border border-white/20
                    rounded-lg
                    shadow-sm
                    text-white
                    transition-colors
                  "
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/506498/google.svg"
                    alt="google"
                  />
                </a>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-slate-300">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-white font-semibold hover:underline"
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
