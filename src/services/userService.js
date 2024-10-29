import axios from "axios";

// Getting user data from local storage
export const getUser = () => {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
};

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

