import React, { useState, useEffect } from 'react';
import TimeSelector from "../../components/TimeSelector/TimeSelector";
import CourseSelector from "../../components/CourseSelector/CourseSelector";
import LocationSelector from "../../components/LocationSelector/LocationSelector";
import "./UserProfile.css";

const UserProfile = () => {
  // Managing tabs within the profile page
  const initialTab = sessionStorage.getItem("activeTab") || 'map';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="profile-container">
      <h1>Welcome to your StudySync Profile!</h1>
      {/* Removed user and setUser props */}
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
        {activeTab === 'schedule' && <TimeSelector type="busy" />}
        {activeTab === 'map' && <LocationSelector />}
      </div>
    </div>
  );
};

export default UserProfile;
