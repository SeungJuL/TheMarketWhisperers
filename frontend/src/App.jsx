import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import AboutUsPage from "./pages/AboutUsPage";
import { ChakraProvider, Box, Container } from '@chakra-ui/react'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token retrieved from localStorage:", token); // Debugging

    if (token) {
      fetch("http://127.0.0.1:8080/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          console.log("Profile API Response:", res); // Debugging
          if (!res.ok) {
            throw new Error("Failed to fetch user profile");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Profile API Data:", data); // Debugging
          if (data.success) {
            setUser(data.data); // Update user state with backend response
          } else {
            localStorage.removeItem("token"); // Remove invalid token
          }
        })
        .catch((err) => {
          console.error("Error fetching profile:", err); // Debugging
          localStorage.removeItem("token"); // Handle fetch errors
        })
        .finally(() => setLoading(false)); // Ensure loading state is updated
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  return (
    <ChakraProvider>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Container maxW="container.xl" py={8}>
            <Navbar user={user} setUser={setUser} />
            <Routes>
              <Route path="/" element={<HomePage user={user} />} />
              <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="/signup" element={<SignupPage setUser={setUser} />} />
              <Route path="/about" element={<AboutUsPage />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
