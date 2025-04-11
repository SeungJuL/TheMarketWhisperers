// Navbar.jsx
import { Link } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 fixed w-full top-0 z-50">
      <div className="flex items-center justify-between h-16 px-8">
        {/* LEFT side: Logo, Dashboard, Profile */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
          >
          Market Whisperer
          </Link>

          {/* Show dashboard link only if logged in */}
          {user && (
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🏠 Dashboard
            </Link>
          )}

          {/* Show profile link only if logged in */}
          {user && (
            <Link
              to="/profile"
              className="text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              👤 Profile
            </Link>
          )}
        </div>

        {/* RIGHT side: Welcome message + Auth buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden md:block text-slate-300 text-sm">
                Welcome,{" "}
                <span className="font-semibold text-white">
                  {user.username || "User"} {/* Ensure username is displayed */}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🔑 Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                📝 Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
