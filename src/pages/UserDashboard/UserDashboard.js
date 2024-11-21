import React, { useState } from "react";
import CreateGroupForm from "../../components/CreateGroupForm/CreateGroupForm";
import { Plus, UserRoundPlus, Filter } from "lucide-react";
import "./UserDashboard.css";
import { useAuth } from "../../hooks/useauth.js"; // Ensure correct path to useAuth

export default function UserDashboard() {
  const { user } = useAuth(); // Get the logged-in user
  const userId = user?._id; // Ensure we retrieve the correct user ID
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateGroupPanelOpen, setIsCreateGroupPanelOpen] = useState(false);
  const items = ["Class", "Time", "Location"]; // Filter options
  const [checkedItems, setCheckedItems] = useState({});

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleCreateGroupPanel = () => {
    setIsCreateGroupPanelOpen(!isCreateGroupPanelOpen);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: checked,
    }));
  };

  const createGroup = async (groupData) => {
    try {
      const response = await fetch("http://localhost:5001/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...groupData, userId }), // Include userId in group creation
      });
      if (response.ok) {
        alert("Group created successfully");
      } else {
        alert("Failed to create group");
      }
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar-container">
        <span className="sidebar-title">My Study Groups</span>
        {["Group 1", "Group 2", "Group 3"].map((group) => (
          <div key={group} className="sidebar-item">
            <span>{group}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header-container">
          <div className="group-search-bar">
            <input type="text" placeholder="Search" />
            {/* Filter */}
            <button className="filter-button" onClick={toggleFilter}>
              <Filter />
            </button>
            {isFilterOpen && (
              <div className="panel">
                <h3>Filter by:</h3>
                <div className="filter-list">
                  {items.map((item) => (
                    <label key={item}>
                      {item}
                      <input
                        type="checkbox"
                        name={item}
                        onChange={handleCheckboxChange}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
            {/* Create Group with Tooltip */}
            <div className="tooltip-container">
              <button
                className="action-button"
                onClick={toggleCreateGroupPanel}
              >
                <Plus />
              </button>
              <span className="tooltip-text">Create Group</span>
            </div>
          </div>
        </div>

        {/* Create Group Panel */}
        {isCreateGroupPanelOpen && (
          <CreateGroupForm
            onCreateGroup={createGroup}
            onClose={toggleCreateGroupPanel}
            userId={user?._id} // Pass userId from context 
          />
        )}

        {/* Available Groups */}
        <div className="group-list">
          <h3 className="group-list-title">Available Study Groups</h3>
          {[1, 2, 3].map((group) => (
            <div key={group} className="group-item">
              <div>
                <div className="group-name">Group {group}</div>
                <div className="group-item-description">Description</div>
              </div>
              <div className="tooltip-container">
              <button className="action-button">
                <UserRoundPlus /> 
              </button>
            <span className="tooltip-text">Join</span>
            </div>
        </div>
          ))}
        </div>
      </div>
    </div>
  );
}
