import React, { useState, useEffect } from 'react';
import TimeSelector from "../../components/TimeSelector/TimeSelector";
import CourseSelector from "../../components/CourseSelector/CourseSelector";
import LocationSelector from "../../components/LocationSelector/LocationSelector";
import { useAuth } from '../../hooks/useauth';
import "./UserProfile.css";

const UserProfile = () => {
  const { user, setUser } = useAuth();

  // Get initial tab state from sessionStorage or default to 'map'
  const initialTab = sessionStorage.getItem("activeTab") || 'map';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update sessionStorage whenever activeTab changes
  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Tab click handler
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
  }, [activeTab]);

  return (
    <div className="profile-container">
      <h1>Welcome to your StudySync Profile!</h1>
      <CourseSelector user={user} setUser={setUser} />
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
        {activeTab === 'schedule' && <TimeSelector />}
        {activeTab === 'map' && <LocationSelector />}
      </div>
    </div>
  );
};

export default UserProfile;
