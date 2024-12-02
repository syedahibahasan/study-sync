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

