import { Link } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="navbar">
      <Link to="/">🏠 Home</Link>
      {user ? (
        <>
          <Link to="/profile">👤 Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">🔑 Login</Link>
          <Link to="/signup">📝 Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
