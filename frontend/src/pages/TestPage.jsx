import { useState } from "react";


const TestPage = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
  
    const handleSignup = async () => {
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
      /*<div className="container">
        <h1>📝 Signup</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={handleSignup}>Sign Up</button>
      </div>*/

      <div class="flex h-screen bg-slate-800 text-white justify-center items-center ">
        
        {/* Container to keep both sections the same size. */}
        <div class="flex w-full max-w-4xl gap-2">
            {/* Left Section */}
            <div class="w-1/2 flex flex-col justify-between items-center bg-slate-700 rounded-lg border border-slate-500 p-8 ml-2 min-h-[400px]">
                <h2 class="text-3xl font-bold mt-2">Why Join?</h2>
                <div class="space-y-6 mb-24 text-center">
                    <div>
                        <h3 class="font-semibold text-lg underline">AI-Guided Insights</h3>
                        <p class="text-white-300">Learn to invest with beginner-friendly advice.</p>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg underline">Clear Visuals</h3>
                        <p class="text-white-300">Understand stocks through simple charts and metrics.</p>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg underline">Track Favorites</h3>
                        <p class="text-white-300">Build watchlists and stay on top of the market.</p>
                    </div>
                </div>
            </div>

            {/* Signup Form */}
            <div class="w-1/2 flex flex-col justify-between items-center bg-slate-700 rounded-lg border border-slate-500 p-8 ml-2 min-h-[400px]">
                <h2 class="text-3xl font-bold mt-2">Sign Up</h2>
                <form class="space-y-6 mt-6 w-3/4 max-w-sm">
                    <div class="mb-4">
                        <label class="block text-sm mb-1">Email</label>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} class="w-full p-2 bg-white-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm mb-1">Password</label>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} class="w-full p-2 bg-white-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm mb-1">Confirm Password</label>
                        <input type="password" placeholder="Confirm Password" class="w-full p-2 bg-white-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                    <button onClick={handleSignup} class="w-full p-2 bg-slate-900 hover:bg-blue-800 rounded text-white font-semibold">Sign Up</button>
                </form>

                <h3 class="text-lg mb-4">Already signed up?
                    <a href="#" class="text-blue-400">Login</a>
                </h3>
            </div>
        </div>       
      </div>
    );
  };
  
  export default TestPage;