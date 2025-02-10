import { useState } from "react";


const SignupPage = ({ setUser }) => {
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
      <div className="container">
        <h1>📝 Signup</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={handleSignup}>Sign Up</button>
      </div>
    );
  };
  
  export default SignupPage;
  