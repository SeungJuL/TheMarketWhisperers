import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
  // Create a mock user for testing the profile page without backend
  const mockUser = {
    email: "investor@example.com",
    username: "smartinvestor",
    created_at: "2023-09-15T10:30:00Z",
    first_name: "Alex",
    last_name: "Johnson",
    bio: "Passionate investor with 5 years of experience in stock markets. Focused on tech and renewable energy sectors.",
    location: "San Francisco, CA",
    profile_image: "https://randomuser.me/api/portraits/people/22.jpg",
    account_type: "Premium",
    watchlist: [
      { symbol: "AAPL", name: "Apple Inc.", added_on: "2023-10-05" },
      { symbol: "TSLA", name: "Tesla, Inc.", added_on: "2023-11-12" },
      { symbol: "MSFT", name: "Microsoft Corporation", added_on: "2023-12-03" }
    ],
    recent_activities: [
      { type: "stock_added", symbol: "NVDA", date: "2024-02-28", description: "Added NVIDIA to watchlist" },
      { type: "analysis_viewed", symbol: "AMZN", date: "2024-02-25", description: "Viewed Amazon market analysis" },
      { type: "profile_updated", date: "2024-02-20", description: "Updated profile information" }
    ],
    preferences: {
      notification_email: true,
      notification_mobile: false,
      theme: "dark",
      default_view: "watchlist"
    }
  };
  
  const [user, setUser] = useState(mockUser); // Use mockUser instead of null

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8080/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user));
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage setUser={setUser} />} />
        <Route path="/about" element={<AboutUsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
