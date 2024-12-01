import axios from "axios";
import { toast } from "react-toastify";

// Helper to get the token
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Save study group times
export const saveStudyGroupTimes = async (userId, selectedTimes) => {
  try {
    const response = await axios.post(`/api/groups/${userId}/studyGroupTimes`, { selectedTimes }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Failed to save study group times:", error);
    toast.error("Could not save study group times");
    throw error;
  }
};

/*
// Fetch study group times
export const fetchStudyGroupTimes = async (groupId) => {
  try {
    const { data } = await axios.get(`/api/groups/${groupId}/study-group-times`, getAuthHeaders());
    return data.studyGroupTimes;
  } catch (error) {
    console.error("Failed to fetch study group times:", error);
    toast.error("Could not fetch study group times");
    throw error;
  }
};

// Create Study Group
export const createStudyGroup = async (groupData) => {
    try {
      console.log("Submitting group data:", groupData); // Debug
      const response = await axios.post(`/api/createGroup`, groupData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Failed to create study group:", error);
      throw error;
    }
  };
  

// Fetch all study groups for a user
export const fetchUserStudyGroups = async (userId) => {
  try {
    const { data } = await axios.get(`/api/users/${userId}/study-groups`, getAuthHeaders());
    return data;
  } catch (error) {
    console.error("Failed to fetch user study groups:", error);
    toast.error("Could not fetch study groups");
    throw error;
  }
};

*/
