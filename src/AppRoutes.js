import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useauth.js";
import LoginPage from "./pages/Login/Login";
import Browsing from "./pages/Home/Browsing";
import Register from "./pages/Register/register";
import SearchResults from "./pages/Searchresult/searchresult";
import About from "./pages/Extra/About";
import Contact from "./pages/Extra/Contact";
import UserProfile from "./pages/UserProfile/UserProfile";  // Import UserProfile

export default function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  // Protected route for pages that require login
  const ProtectedRoute = ({ children }) => {
    return user ? (
      children
    ) : (
      <Navigate to="/login" replace state={{ from: location }} />
    );
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Browsing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Protected UserProfile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
