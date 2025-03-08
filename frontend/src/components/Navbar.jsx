import { Link } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and primary navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              📈 MarketWhisperer
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🏠 Dashboard
              </Link>
              {user && (
                <Link 
                  to="/profile" 
                  className="text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  👤 Profile
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Auth buttons or user menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <span className="text-slate-300 text-sm">
                    Welcome, <span className="font-semibold text-white">{user.first_name}</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
