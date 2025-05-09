import React, { useState, useEffect } from "react";
import PageWrapper from '../components/PageWrapper';
import { useNavigate } from "react-router-dom"; // Add this import

const ProfilePage = ({ user }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    phone_number: user?.phone_number || ""
  });
  const [preferences, setPreferences] = useState(user?.preferences || {});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [newItem, setNewItem] = useState({ asset_symbol: "" });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  useEffect(() => {
    if (activeTab === 'watchlist') {
      fetchWatchlistData();
    }
  }, [activeTab]);

  const fetchWatchlistData = async () => {
    setMessage("");
    setError("");
    try {
      const response = await fetch("http://localhost:8080/watchlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }

      const data = await response.json();
      if (data.success) {
        setWatchlist(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch watchlist");
      }
    } catch (error) {
      setError("Failed to fetch watchlist");
    }
  };

  const handleAddToWatchlist = async () => {
    setMessage("");
    setError("");
    try {
      // First fetch the stock name using the search endpoint
      const searchRes = await fetch(
        "http://localhost:8080/stock/search?stock_name=" + newItem.asset_symbol
      );
      const stocks = await searchRes.json();
      
      if (!stocks.success || !stocks.data || !stocks.data[0]) {
        setError("Invalid stock symbol. Please try again.");
        return;
      }

      const stockName = stocks.data[0]["2. name"];
      const stockSymbol = stocks.data[0]["1. symbol"];

      // Then add to watchlist with both symbol and name
      const response = await fetch("http://localhost:8080/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          asset_symbol: stockSymbol,
          name: stockName
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Item added to watchlist successfully!");
        setNewItem({ asset_symbol: "" });
        fetchWatchlistData();
      } else {
        setError(data.message || "Failed to add item to watchlist");
      }
    } catch (error) {
      console.error("Add to Watchlist Error:", error);
      setError("Failed to connect to the server");
    }
  };

  const handleRemoveFromWatchlist = async (asset_symbol) => {
    setMessage("");
    setError("");
    try {
      const response = await fetch("http://localhost:8080/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
        body: JSON.stringify({ asset_symbol }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Item removed from watchlist successfully!");
        fetchWatchlistData();
      } else {
        setError(data.message || "Failed to remove item from watchlist");
      }
    } catch (error) {
      console.error("Remove from Watchlist Error:", error);
      setError("Failed to connect to the server");
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleProfileUpdate = async () => {
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:8080/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
        body: JSON.stringify(profileData), // Ensure email is included in profileData
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update Error:", error);
      setError("Failed to connect to the server");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    setMessage("");
    setError("");

    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("New passwords do not match");
      return;
    }

    // Validate password length
    if (passwordData.new_password.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Password updated successfully!");
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: ""
        });
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password Update Error:", error);
      setError("Failed to connect to the server");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  };

  const handleWatchlistItemClick = (assetSymbol) => {
    navigate(`/dashboard?stock=${encodeURIComponent(assetSymbol)}`); // Ensure proper encoding of the asset symbol
  };

  return (
    <PageWrapper>
      <div className="flex flex-col min-h-screen">
        <div className="max-w-6xl mx-auto px-4 w-full mt-28">
          {/* Header Section - Fixed height */}
          <div className="bg-slate-700 rounded-lg border border-slate-500 p-6 mb-6 h-[120px]">
            <div className="flex items-center space-x-6 h-full"> {/* Adjusted alignment */}
              <img
                src={user.profile_image || "/default-profile-icon.png"} // Default profile icon
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-slate-500"
              />
              <div>
                <h1 className="text-3xl font-bold">{user.first_name} {user.last_name}</h1>
                <p className="text-slate-300">@{user.username || "N/A"}</p> {/* Ensure username is displayed */}
                <div className="flex items-center mt-2">
                  <span className="bg-blue-600 text-xs px-2 py-1 rounded">
                    {user.account_type}
                  </span>
                  <span className="ml-4 text-sm text-slate-400">
                    Member since {formatDate(user.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Fixed height */}
          <div className="flex space-x-4 h-[48px] mb-2">
            {['profile', 'watchlist', 'settings'].map((tab) => ( // Removed 'activity'
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="mb-4">
            {message && <div className="w-full p-4 bg-green-800 text-white rounded-lg">{message}</div>}
            {error && <div className="w-full p-4 bg-red-800 text-white rounded-lg">{error}</div>}
          </div>

          {/* Tab Content - Fixed height with overflow */}
          <div className="bg-slate-700 rounded-lg border border-slate-500 p-6 h-[calc(100vh-400px)] overflow-y-auto">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="h-full">
                {!isEditing ? (
                  <div className="space-y-6">
                    {/* Username */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Username</h2>
                      <p className="text-slate-300">{user.username || "N/A"}</p>
                    </div>

                    {/* Email */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Email</h2>
                      <p className="text-slate-300">{user.email || "N/A"}</p>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Phone Number</h2>
                      <p className="text-slate-300">{user.phone_number || "N/A"}</p>
                    </div>

                    {/* Biography */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Biography</h2>
                      <p className="text-slate-300">{user.bio || "N/A"}</p>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-slate-900 hover:bg-blue-800 rounded text-white font-semibold"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Username */}
                      <div className="mb-4">
                        <label className="block text-sm mb-1">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                          className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>

                      {/* Email */}
                      <div className="mb-4">
                        <label className="block text-sm mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="mb-4">
                        <label className="block text-sm mb-1">Phone Number</label>
                        <input
                          type="text"
                          name="phone_number"
                          value={profileData.phone_number}
                          onChange={handleProfileChange}
                          className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    {/* Biography */}
                    <div className="mb-4">
                      <label className="block text-sm mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows="4"
                        className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={handleProfileUpdate}
                        className="px-4 py-2 bg-slate-900 hover:bg-blue-800 rounded text-white font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Watchlist Tab */}
            {activeTab === 'watchlist' && (
              <div className="h-full">
                <h2 className="text-xl font-semibold mb-4">My Watchlist</h2>
                {message && <div className="w-full p-4 bg-green-800 text-white rounded-lg">{message}</div>}
                {error && <div className="w-full p-4 bg-red-800 text-white rounded-lg">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {watchlist.map((item) => (
                    <div
                      key={item.asset_symbol}
                      className="bg-slate-600 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-slate-500"
                      onClick={() => handleWatchlistItemClick(item.asset_symbol)} // Pass asset symbol to the function
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-slate-300">{item.asset_symbol}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the parent click event
                          handleRemoveFromWatchlist(item.asset_symbol);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Add to Watchlist</h3>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Asset Symbol"
                      value={newItem.asset_symbol}
                      onChange={(e) => setNewItem({ asset_symbol: e.target.value })}
                      className="w-1/2 p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={handleAddToWatchlist}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="h-full space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-slate-300">Receive updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.notification_email}
                          onChange={() => handlePreferenceChange('notification_email')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                      <div>
                        <h3 className="font-medium">Mobile Notifications</h3>
                        <p className="text-sm text-slate-300">Receive push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.notification_mobile}
                          onChange={() => handlePreferenceChange('notification_mobile')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Change Password Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                  <div className="space-y-4 bg-slate-600 rounded-lg p-6">
                    <div>
                      <label className="block text-sm mb-2">Current Password</label>
                      <input
                        type="password"
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">New Password</label>
                      <input
                        type="password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
