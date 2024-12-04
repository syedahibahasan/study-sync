import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as userService from "../services/userService";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userService.getUser());
  const navigate = useNavigate();

  // Check session validity and handle token expiration
  const checkSessionValidity = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      handleSessionExpired();
      return false;
    }

    const decodedToken = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      handleSessionExpired();
      return false;
    }

    return true;
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  };

  const handleSessionExpired = () => {
    toast.error("Session expired. Please log in again.");
    logout();
    navigate("/login");
  };

  useEffect(() => {
    // Check session validity on component mount
    checkSessionValidity();

    // Periodically check session validity every minute
    const intervalId = setInterval(() => {
      if (!checkSessionValidity()) {
        clearInterval(intervalId);
      }
    }, 60000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  //login
  const login = async (email, password) => {
    try {
      const response = await userService.login(email, password);
      setUser(response.user);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Login failed");
    }
  };

  const register = async (data) => {
    try {
      const response = await userService.register(data);
      setUser(response.user);
      toast.success("Registered successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const fetchEnrolledCourses = async () => {
    try {
      return await userService.fetchEnrolledCourses(user._id); // Use the function from userService.js
    } catch (error) {
      console.error("Failed to fetch enrolled courses", error);
      toast.error("Could not fetch enrolled courses");
    }
  };
  
  const saveEnrolledCourses = async (course, operationType) => {
    try {
      const updatedCourses =
        operationType === "added"
          ? await userService.addCourse(user._id, course._id)
          : await userService.removeCourse(user._id, course._id);
  
      setUser({ ...user, enrolledCourses: updatedCourses }); // Update the user context with enrolled courses
      toast.success(`Course ${operationType === "added" ? "added" : "removed"} successfully!`);
    } catch (error) {
      console.error("Failed to update enrolled courses", error);
      toast.error("Could not update enrolled courses");
    }
  };
  
//Schedule
const saveSchedule = async (schedule) => {
  // Ensure this function is defined here
  try {
    const updatedUser = await userService.saveSchedule(user._id, schedule);
    setUser(updatedUser);
    toast.success("Schedule saved successfully!");
  } catch (err) {
    console.error("Failed to save schedule", err);
    toast.error("Could not save schedule");
  }
};


const fetchSchedule = async () => {
  try {
    const schedule = await userService.fetchSchedule(user._id); 
    //setUser({ ...user, schedule }); // just return the users schedule don't try and save it to local browser storage
    return schedule;
  } catch (error) {
    console.error("Error refreshing schedule:", error);
    toast.error("Failed to refresh the schedule. Please try again.");
  }
};

// Groups
const createGroup = async (groupData) => {
  try {
    const groups = await userService.createGroup(user._id, groupData); 
    return groups;
  } catch (error) {
    console.error("Error creating group:", error);
    toast.error("Failed to create group. Please try again.");
  }
}


const joinGroup = async (groupData) => {
  try {
    const response = await userService.joinGroup(user._id, groupData); 
    const updatedGroups = await fetchMyGroups(); // Fetch the updated list of joined groups
    setUser({ ...user, groups: updatedGroups.myGroups.map((g) => g._id) }); // Update the user context with new groups
    toast.success("Successfully joined the group!");
    return response;
  } catch (error) {
    console.error("Error joining group:", error);
    toast.error("Failed to join the group. Please try again.");
  }
};

const fetchMatchingGroups = async () => {
  try {
    const groups = await userService.fetchMatchingGroups(user._id); 
    return groups;
  } catch (error) {
    console.error("Error fetching groups:", error);
    toast.error("Failed to get groups. Please try again.");
  }
}

const fetchMyGroups = async () => {
  try {
    const groups = await userService.fetchMyGroups(user._id); 
    return groups;
  } catch (error) {
    console.error("Error fetching user's groups:", error);
    toast.error("Failed to get user's groups. Please try again.");
  }
}

const savePreferredLocations = async (locations, operationType) => {
  try {
    const updatedLocations = await userService.savePreferredLocations(user._id, locations);
    setUser(updatedLocations);  // should not need this

    // Show appropriate toast message based on the operation type
    if (operationType === "added") {
      toast.success("Preferred location added!");
    } else {
      toast.success("Preferred location removed!");
    }
  } catch (error) {
    console.error("Failed to update preferred locations", error);
    toast.error("Could not update preferred locations");
  }
};

const fetchPreferredLocations = async () => {
  try {
    const fetchedLocations = await userService.fetchPreferredLocations(user._id);
    return (fetchedLocations);

  } catch (error) {
    console.error("Failed to fetch preferred locations", error);
    toast.error("Could not fetch preferred locations");
  }
};

const saveGroupSchedule = async (userId, groupTimes) => {
  if (!userId || !Array.isArray(groupTimes)) {
    console.error("Invalid inputs for saving group schedule");
    return;
  }
  try {
    const response = await userService.updateUserGroupTime(userId, groupTimes);
    toast.success("Group times saved successfully!");
    return response; // Return data if needed
  } catch (error) {
    console.error("Failed to save group times:", error?.response?.data || error.message);
    toast.error(error?.response?.data?.message || "Could not save group times. Please try again.");
  }
};



return (
  <AuthContext.Provider
    value={{
      user,
      setUser,
      login,
      logout,
      register,
      fetchEnrolledCourses, 
      saveEnrolledCourses, 
      saveSchedule,
      fetchSchedule,
      fetchPreferredLocations,
      savePreferredLocations,
      saveGroupSchedule,
      fetchMatchingGroups,
      fetchMyGroups,
      createGroup,
      joinGroup,
    }}
  >
    {children}
  </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);