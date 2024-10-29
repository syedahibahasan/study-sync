//FRONTEND USER FUNCTIONS
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

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
