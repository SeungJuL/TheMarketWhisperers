import React, { useState, useEffect } from "react";
import PageWrapper from '../components/PageWrapper';

const ProfilePage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: user?.bio || "",
    location: user?.location || ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preferences, setPreferences] = useState(user?.preferences || {});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [newItem, setNewItem] = useState({ asset_symbol: "", name: "" });

  useEffect(() => {
    if (activeTab === 'watchlist') {
      fetchWatchlist();
    }
  }, [activeTab]);

  const fetchWatchlist = async () => {
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      console.log("Token retrieved from localStorage:", token); // Debugging
      const response = await fetch("http://127.0.0.1:8080/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Watchlist API Response:", response); // Debugging
      const data = await response.json();
      if (data.success) {
        setWatchlist(data.data);
      } else {
        setError(data.message || "Failed to fetch watchlist");
      }
    } catch (error) {
      console.error("Fetch Watchlist Error:", error);
      setError("Failed to connect to the server");
    }
  };

  const handleAddToWatchlist = async () => {
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8080/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Item added to watchlist successfully!");
        setNewItem({ asset_symbol: "", name: "" });
        fetchWatchlist();
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
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8080/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ asset_symbol }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Item removed from watchlist successfully!");
        fetchWatchlist();
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
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
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8080/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
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

  const handlePasswordUpdate = async () => {
    setMessage("");
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8080/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password Change Error:", error);
      setError("Failed to connect to the server");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                <p className="text-slate-300">@{user.username}</p>
                <div className="flex items-center mt-2">
                  <span className="bg-blue-600 text-xs px-2 py-1 rounded">
                    {user.account_type}
                  </span>
                  <span className="ml-4 text-sm text-slate-400">
                    Member since {user.created_at ? formatDate(user.created_at) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Fixed height */}
          <div className="flex space-x-4 h-[48px] mb-2">
            {['profile', 'watchlist', 'activity', 'settings'].map((tab) => (
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
                    <div>
                      <h2 className="text-xl font-semibold mb-4">About Me</h2>
                      <p className="text-slate-300">{user.bio}</p>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400">Email</p>
                          <p>{user.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Username</p>
                          <p>{user.username}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-slate-900 hover:bg-blue-800 rounded text-white font-semibold"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="px-4 py-2 bg-slate-900 hover:bg-blue-800 rounded text-white font-semibold"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="mb-4">
                        <label className="block text-sm mb-1">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={profileData.first_name}
                          onChange={handleProfileChange}
                          className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm mb-1">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={profileData.last_name}
                          onChange={handleProfileChange}
                          className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
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
                    <div className="mb-4">
                      <label className="block text-sm mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileChange}
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
                      className="bg-slate-600 p-4 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-slate-300">{item.asset_symbol}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromWatchlist(item.asset_symbol)}
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
                      onChange={(e) => setNewItem({ ...newItem, asset_symbol: e.target.value })}
                      className="w-1/3 p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-1/3 p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="h-full">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {user.recent_activities.map((activity, index) => (
                    <div
                      key={index}
                      className="bg-slate-600 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                        <div>
                          <p>{activity.description}</p>
                          <p className="text-sm text-slate-300">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                      {activity.symbol && (
                        <span className="bg-slate-700 px-2 py-1 rounded text-sm">
                          {activity.symbol}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="h-full">
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
            )}

            {/* Password Change Form */}
            {isChangingPassword && (
              <div className="mt-8 pt-6 border-t border-slate-500">
                <h2 className="text-2xl font-bold mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 text-black bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handlePasswordUpdate}
                      className="px-4 py-2 bg-slate-900 hover:bg-blue-800 rounded text-white font-semibold"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => setIsChangingPassword(false)}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white font-semibold"
                    >
                      Cancel
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
