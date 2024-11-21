import { useState, createContext, useContext } from "react";
import * as userService from "../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userService.getUser());
  const navigate = useNavigate();

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

  // useAuth.js
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

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register, saveSchedule, fetchSchedule, fetchPreferredLocations, savePreferredLocations }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);