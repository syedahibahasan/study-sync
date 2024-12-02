import React, { useState, useEffect } from "react";
import CreateGroupForm from "../../components/CreateGroupForm/CreateGroupForm";
import { Plus, UserRoundPlus, Filter } from "lucide-react";
import "./UserDashboard.css";
import { useAuth } from "../../hooks/useauth.js"; // Ensure correct path to useAuth

export default function UserDashboard() {
  const { user, fetchMatchingGroups, fetchMyGroups, createGroup } = useAuth(); // Get the logged-in user
  const userId = user?._id; // Ensure we retrieve the correct user ID
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateGroupPanelOpen, setIsCreateGroupPanelOpen] = useState(false);
  const items = ["Class", "Time", "Location"]; // Filter options
  const [checkedItems, setCheckedItems] = useState({});

  const [matchingGroups, setMatchingGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);

  async function loadMatchingGroups(){
    const groups = await fetchMatchingGroups();
    setMatchingGroups(groups.matchingGroups);
  };

  async function loadMyGroups(){
    const groups = await fetchMyGroups();
    setMyGroups(groups.myGroups);
  };

  useEffect(() => {
    loadMatchingGroups();
    loadMyGroups();
  }, []);

  

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

  const actionCreateGroup = async (groupData) => {
    createGroup(groupData);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar-container">
        <span className="sidebar-title">My Study Groups</span>
        {myGroups && myGroups.length > 0 ? (
          myGroups.map((group) => (
            <div key={group._id} className="sidebar-item">
              <span>{group.name} - {group.courseName}</span>
            </div>
          ))
        ) : (
          <div>Loading Your Groups...</div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header-container">
          <div className="group-search-bar">
            <input type="text" placeholder="Search" />
            {/* Filter */}
            <div className="tooltip-container">
            <button className="filter-button" onClick={toggleFilter}>
              <Filter />
            </button>
            <span className="tooltip-text">Filter</span></div>
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
            onCreateGroup={actionCreateGroup}
            onClose={toggleCreateGroupPanel}
            userId={user?._id} // Pass userId from context 
          />
        )}

        {/* Available Groups */}
        <div className="group-list">
          <h3 className="group-list-title">Available Study Groups</h3>
          {matchingGroups && matchingGroups.length > 0 ? (
            matchingGroups.map((group) => (
              <div key={group._id} className="group-item">
                <div>
                  <div className="group-name">{group.name}</div>
                  <div className="group-item-description">{group.courseName} - {group.location}</div>
                </div>
                <div className="tooltip-container">
                <button className="action-button">
                  <UserRoundPlus /> 
                </button>
                <span className="tooltip-text">Join</span>
                </div>
              </div>
            ))
          ) : (
            <div>Loading Groups Matching Your Preferences...</div>
          )}
        </div>
      </div>
    </div>
  );
}
