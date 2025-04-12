import React, { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom"; // Add this import

const SignupPage = ({ setUser }) => {
  const navigate = useNavigate(); // Define navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const validatePassword = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!regex.test(password)) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      const response = await fetch("http://127.0.0.1:8080/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token); // Store JWT token
        setUser(data.data); // Update user state
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        alert("Signup failed!");
      }
    } catch (error) {
      alert("Failed to connect to the server.");
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
            backgroundImage: 'url("/backgroundhome.png")',
            filter: "brightness(0.5)",
          }}
        />
        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
            {/* Left Section: Reasons to Join */}
            <div className="flex flex-col gap-6 bg-opacity-0 backdrop-blur-lg rounded-2xl shadow-md p-8 border border-white/20 text-white">
              <h2 className="text-3xl font-bold text-center mb-4">Why Join?</h2>

              <div className="space-y-6 text-center">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Learn as You Invest
                  </h3>
                  <p className="text-slate-300">
                    Interactive tips and easy explanations help you build
                    confidence step by step.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    AI Insights, No Jargon
                  </h3>
                  <p className="text-slate-300">
                    Get plain-English summaries of stock performance, powered by
                    AI.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Track Stocks with Ease
                  </h3>
                  <p className="text-slate-300">
                    Use our simple watchlist to follow your favorite stocks—no
                    clutter, no confusion.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Stay Ahead, Effortlessly
                  </h3>
                  <p className="text-slate-300">
                    See real-time market trends and investor sentiment in just
                    seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section: Signup Form */}
            <div className="flex flex-col bg-opacity-0 backdrop-blur-lg rounded-2xl shadow-md p-8 border border-white/20 text-white justify-between">
              <h2 className="text-3xl font-bold text-center mb-4">Sign Up</h2>

              <form
                onSubmit={handleSignup}
                className="space-y-6 w-full max-w-sm mx-auto mt-4"
              >
                {/* Email Field + Icon */}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    required
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
                  {/* Envelope Icon */}
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
                        d="M21.75 6.75v10.5a2.25 
                           2.25 0 0 1-2.25 2.25h-15a2.25 
                           2.25 0 0 1-2.25-2.25V6.75m19.5 
                           0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 
                           2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 
                           2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 
                           2.25 0 0 1-2.36 0l-7.5-4.615A2.25 
                           2.25 0 0 1 3.32 6.993V6.75"
                      />
                    </svg>
                  </div>
                </div>

                {/* Username Field + Icon */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                  {/* User Icon */}
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 text-slate-300"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Password Field + Icon */}
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    required
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
                  {/* Lock Icon */}
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
                        d="M16.5 10.5V6.75a4.5 
                           4.5 0 1 0-9 0v3.75m-.75 
                           11.25h10.5a2.25 2.25 0 
                           0 0 2.25-2.25v-6.75a2.25 
                           2.25 0 0 0-2.25-2.25H6.75
                           a2.25 2.25 0 0 0-2.25 
                           2.25v6.75a2.25 2.25 
                           0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Confirm Password Field + Icon */}
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {/* Lock Icon (same as password) */}
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
                        d="M16.5 10.5V6.75a4.5 
                           4.5 0 1 0-9 0v3.75m-.75 
                           11.25h10.5a2.25 2.25 
                           0 0 0 2.25-2.25v-6.75a2.25 
                           2.25 0 0 0-2.25-2.25H6.75
                           a2.25 2.25 0 0 0-2.25 
                           2.25v6.75a2.25 2.25 
                           0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                {/* Sign Up Button */}
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
                  Sign Up
                </button>
              </form>

              <h3 className="text-md mt-6 text-center">
                Already signed up?{" "}
                <a href="/login" className="text-white hover:underline">
                  Login
                </a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SignupPage;
