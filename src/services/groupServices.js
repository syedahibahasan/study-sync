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

export const fetchGroupDetails = async (groupId) => {
  try {
    const response = await axios.get(`/api/groups/${groupId}`, getAuthHeaders());
    if (response.headers['content-type']?.includes('application/json')) {
      return response.data;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching group details:", error);
  }
};

//delete group
export const deleteGroup = async (userId, groupId) => {
  const token = localStorage.getItem("token");
  const url = `/api/groups/${userId}/deleteGroup/${groupId}`;
  console.log("DELETE request to:", url); // Debugging
  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
};

//leave group
export const leaveGroup = async (userId, groupId) => {
  const token = localStorage.getItem("token");
  const url = `/api/groups/${userId}/leaveGroup/${groupId}`;

  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
};


  //Chatting 
  export const sendMessage = async (groupId, message) => {
    try {
      const { data } = await axios.post(`/api/groups/${groupId}/message`, { text: message }, getAuthHeaders());
      return data.messages;
    } catch (error) {
      console.error("Error sending message:", error?.response?.data || error.message);
      throw new Error("Failed to send the message. Please try again.");
    }
  };
  
  export const fetchMessages = async (groupId) => {
    try {
      const { data } = await axios.get(`/api/groups/${groupId}/messages`, getAuthHeaders());
      return data.messages;
    } catch (error) {
      console.error("Error fetching messages:", error?.response?.data || error.message);
      throw new Error("Failed to fetch messages. Please try again.");
    }
  };
  
  

