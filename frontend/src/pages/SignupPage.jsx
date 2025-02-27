import { useState } from "react";


const SignupPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const validatePassword = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!regex.test(password)) {
      setError("Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.");
      return false;
    }

    if (password != confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError(""); // Clear error if valid
    return true;
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    const response = await fetch("http://127.0.0.1:8080/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } else {
      alert("Signup failed!");
    }
  };

  return (

    <div class="flex h-screen bg-slate-800 text-white justify-center items-center ">
      
      {/* Container to keep both sections the same size. */}
      <div class="flex w-full max-w-4xl gap-2">
        
          {/* Left Section */}
          <div class="w-1/2 flex flex-col justify-between items-center bg-slate-700 rounded-lg border border-slate-500 p-8 ml-2 min-h-[400px]">
              <h2 class="text-3xl font-bold mt-2">Why Join?</h2>
              <div class="space-y-6 mb-14 text-center">
                  <div>
                    <h3 class="font-semibold text-lg underline">Learn as You Invest</h3>
                    <p class="text-white-300">Interactive tips and easy explanations help you build confidence step by step.</p>
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg underline">AI Insights, No Jargon</h3>
                    <p class="text-white-300">Get plain-English summaries of stock performance, powered by AI.</p>
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg underline">Track Stocks with Ease</h3>
                    <p class="text-white-300">Use our simple watchlist to follow your favorite stocks—no clutter, no confusion.</p>
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg underline">Stay Ahead, Effortlessly</h3>
                    <p class="text-white-300">See real-time market trends and investor sentiment in just seconds.</p>
                  </div>
              </div>
          </div>

          {/* Signup Form */}
          <div class="w-1/2 flex flex-col justify-between items-center bg-slate-700 rounded-lg border border-slate-500 p-8 ml-2 min-h-[400px]">
              <h2 class="text-3xl font-bold mt-2">Sign Up</h2>
              <form class="space-y-6 mt-6 w-3/4 max-w-sm">
                  <div class="mb-4">
                    <label class="block text-sm mb-1">Email</label>
                    <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} class="w-full p-2 text-black bg-white-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div class="mb-4">
                    <label class="block text-sm mb-1">Username</label>
                    <input type="username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} class="w-full p-2 text-black bg-white-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div class="mb-4">
                    <label class="block text-sm mb-1">Password</label>
                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} class="w-full p-2 text-black bg-white-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div class="mb-4">
                    <label class="block text-sm mb-1">Confirm Password</label>
                    <input type="password" placeholder="Confirm Password" required onChange={(e) => setConfirmPassword(e.target.value)} class="w-full p-2 text-black bg-white-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  {error && <p class="text-red-500 text-sm mb-4">{error}</p>}
                  <button onClick={handleSignup} class="w-full p-2 bg-slate-900 hover:bg-blue-800 rounded text-white font-semibold">Sign Up</button>
              </form>

              <h3 class="text-lg mb-4">Already signed up? 
                  <a href="#" class="text-blue-400"> Login</a>
              </h3>
          </div>
      </div>       
    </div>
  );
};
  
  export default SignupPage;
  