const ProfilePage = ({ user }) => {
    return (
      <div className="container">
        <h1>👤 User Profile</h1>
        <p>Email: {user.email}</p>
        <p>Username: {user.username}</p>
        <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    );
  };
  
  export default ProfilePage;
  