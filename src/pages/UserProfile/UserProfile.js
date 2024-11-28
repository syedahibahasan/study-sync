import React, { useState, useEffect } from 'react';
import TimeSelector from "../../components/TimeSelector/TimeSelector";
import CourseSelector from "../../components/CourseSelector/CourseSelector";
import LocationSelector from "../../components/LocationSelector/LocationSelector";
import { useAuth } from "../../hooks/useauth"; // For fetching the user's schedule
import "./UserProfile.css";

const UserProfile = () => {
  const { fetchSchedule } = useAuth(); // Auth hook to fetch schedule
  const initialTab = sessionStorage.getItem("activeTab") || 'map';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userSchedule, setUserSchedule] = useState([]); // Stores the user's busy times

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Fetch the user's busy schedule on component load
  useEffect(() => {
    const loadUserSchedule = async () => {
      try {
        const schedule = await fetchSchedule();
        setUserSchedule(schedule); // Populate busy times
      } catch (error) {
        console.error("Failed to fetch user schedule:", error);
      }
    };

    if (activeTab === 'schedule') {
      loadUserSchedule();
    }
  }, [activeTab, fetchSchedule]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="profile-container">
      <h1>Welcome to your StudySync Profile!</h1>
      <CourseSelector />
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => handleTabClick('schedule')}
        >
          Schedule
        </button>
        <button
          className={`tab-button ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => handleTabClick('map')}
        >
          Map
        </button>
      </div>
      <div className="tab-content">
      {activeTab === 'schedule' && (
    <TimeSelector
    userSchedule={userSchedule} // Pass busy times
    highlightType="busy"
    editable={true} // Allow editing
  />
  
)}
 
        {activeTab === 'map' && <LocationSelector />}
      </div>
    </div>
  );
};

export default UserProfile;
