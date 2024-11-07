import React from "react";
import { useState } from 'react';
import TimeSelector from "../../components/TimeSelector/TimeSelector";
import "./UserProfile.css";

const UserProfile = () => {
  
  return (
    
    <div className="profile-container">
      <h1>Welcome to your StudySync Profile!</h1>
      <p className="intro-text">
        Enter your preferred schedule and location to make study group organization easy and fun!
      </p>

      <form className="profile-form">
        <label>
        

        <TimeSelector/>
        
        </label>
        
        <label>
          Preferred Locations:
          <input type="text" placeholder="e.g., Library, Room 204, Online" />
        </label>
        
        <label>
          Course Schedule:
          <textarea placeholder="List your courses and timings here..." />
        </label>
        
        <button type="submit" className="save-button">Save Preferences</button>
      </form>
    </div>
  );
};

export default UserProfile;
