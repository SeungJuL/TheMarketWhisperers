export const fetchUserProfile = async () => {
  try {
    const response = await fetch("http://localhost:8080/user/profile", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch user profile");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
