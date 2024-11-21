import axios from "axios";
import { toast } from 'react-toastify';

// Getting user data from local storage
export const getUser = () => {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
};

axios.interceptors.response.use(
  response => response, // if response is OK, just return it
  error => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please log in again.");
      // Redirect to login page or handle logout
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// User login function
export const login = async (email, password) => {
  const { data } = await axios.post("http://localhost:5001/api/users/login", { email, password });
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token); // Store the JWT token
  }
  return data;
};

// User logout function
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  console.log("User logged out");
};

// User registration function
export const register = async (registerData) => {
  const { data } = await axios.post("http://localhost:5001/api/users/register", {
    email: registerData.email,
    username: registerData.username,
    password: registerData.password
  });
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  }
  return data;
};


//Courses
// Fetch all available courses
export const getCourses = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`/api/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // Return the array directly since backend sends the array
};

// Fetch enrolled courses for a specific user
export const fetchEnrolledCourses = async (userId) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`/api/users/${userId}/enrolled-courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.enrolledCourses;
};

// Add a course to the user's enrolled courses
export const addCourse = async (userId, courseId) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `/api/users/${userId}/courses/add`,
    { courseId },
    { headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.enrolledCourses; // Return updated enrolled courses
};

// Remove a course from the user's enrolled courses
export const removeCourse = async (userId, courseId) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `/api/users/${userId}/courses/remove`,
    { courseId },
    { headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.enrolledCourses; // Return updated enrolled courses
};


//Schedule
export const saveSchedule = async (userId, schedule) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `http://localhost:5001/api/users/${userId}/schedule`,
    { schedule },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const fetchSchedule = async (userId) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
      `/api/users/${userId}/schedule`,
      { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.schedule;
};

export const savePreferredLocations = async (userId, preferredLocations) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `http://localhost:5001/api/users/${userId}/preferred-locations`,
    { preferredLocations },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.user;
};

export const fetchPreferredLocations = async (userId) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `http://localhost:5001/api/users/${userId}/preferred-locations`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  return data.preferredLocations;
};
