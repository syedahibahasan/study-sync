// services/courseService.js
import axios from 'axios';

export const getCourses = async (searchTerm = "") => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`/api/courses`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { search: searchTerm }, // Pass the search term as a query parameter
  });
  return data; // Return filtered courses
};
