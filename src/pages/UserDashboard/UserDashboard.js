import React, { useState, useEffect } from "react";
import CreateGroupForm from "../../components/CreateGroupForm/CreateGroupForm";
import ChatGroup from "../../components/ChatGroup/ChatGroup"; // Chat area component
import { Plus, UserRoundPlus, Filter, ChevronDown, ChevronUp } from "lucide-react";
import "./UserDashboard.css";
import { useAuth } from "../../hooks/useauth.js";

export default function UserDashboard() {
  const { user, fetchMatchingGroups, fetchMyGroups, createGroup, joinGroup } = useAuth();
  const userId = user?._id;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateGroupPanelOpen, setIsCreateGroupPanelOpen] = useState(false);
  const [matchingGroups, setMatchingGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState([]);

  useEffect(() => {
    loadMatchingGroups();
    loadMyGroups();
  }, []);

  async function loadMatchingGroups() {
    const groups = await fetchMatchingGroups();
    setMatchingGroups(groups.matchingGroups || []);
  }

  async function loadMyGroups() {
    const groups = await fetchMyGroups();
    setMyGroups(groups.myGroups || []);
  }

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const toggleCreateGroupPanel = () => setIsCreateGroupPanelOpen(!isCreateGroupPanelOpen);

  const joinGivenGroup = async (groupData) => {
    try {
      await joinGroup(groupData); // Wait for the group to be joined
      await loadMyGroups(); // Refresh "My Study Groups" to reflect the joined group
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };
  

  const actionCreateGroup = async (groupData) => {
    await createGroup(groupData);
    await loadMyGroups(); // Refresh "My Study Groups"
    await loadMatchingGroups(); // Refresh "Available Study Groups" if necessary
  };

  const handleGroupSelect = (group) => setSelectedGroup(group);

  const handleBack = () => setSelectedGroup(null);
  
  const toggleGroupExpansion = (groupId) => {
    setExpandedGroups((prev) =>
    prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar-container">
        <span className="sidebar-title">My Study Groups</span>
        {myGroups && myGroups.length > 0 ? (
          myGroups.map((group) => (
            <div key={group._id}>
              <div
                className={`sidebar-item ${selectedGroup?._id === group._id ? "selected" : ""}`}
                onClick={() => handleGroupSelect(group)}
              >
                <span>{group.name || "Untitled Group"}</span>
                {/* Expand/Collapse Button */}
                <button
                  className="expand-button"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    toggleGroupExpansion(group._id);
                  }}
                  aria-label="Expand group details"
                >
                  {expandedGroups.includes(group._id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              {/* Expanded Details */}
              <div
                className={`expanded-details ${
                  expandedGroups.includes(group._id) ? "expanded" : ""
                }`}
              >
                <p>
                  <span className="label">Course:</span> <span className="detail-value">{group.courseName || "N/A"}</span>
                </p>
                <p>
                  <span className="label">Location:</span> <span className="detail-value">{group.location || "N/A"}</span>
                </p>
                <p>
                  <span className="label">Members:</span> <span className="detail-value">{group.members?.length || 0}</span>
                </p>
                <p className="members-joined">
                  <span className="label">Members joined:</span> <span className="detail-value">
                    {group.members && group.members.length > 0 ? group.members.map(member => member.username).join(", ") : "No members joined yet."}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div>No Groups Available</div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedGroup ? (
          <ChatGroup group={selectedGroup} onBack={handleBack} />
        ) : (
          <div>
            {/* Header */}
            <div className="header-container">
              <div className="group-search-bar">
                <input type="text" placeholder="Search" />
                <div className="tooltip-container">
                  <button className="filter-button" onClick={toggleFilter} aria-label="Filter groups">
                    <Filter />
                  </button>
                  <span className="tooltip-text">Filter</span>
                </div>
                {isFilterOpen && (
                  <div className="panel">
                    <h3>Filter by:</h3>
                    <div className="filter-list">
                      {["Class", "Time", "Location"].map((item) => (
                        <label key={item}>
                          {item}
                          <input type="checkbox" name={item} />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="tooltip-container">
                  <button
                    className="action-button"
                    onClick={toggleCreateGroupPanel}
                    aria-label="Create a new group"
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
                userId={userId}
                loadMyGroups={loadMyGroups} // Pass the function
                loadMatchingGroups={loadMatchingGroups} // Pass the function
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
                      <div className="group-item-description">
                        <p><strong>Course:</strong> {group.courseName || "N/A"}</p>
                        <p><strong>Location:</strong> {group.location || "N/A"}</p>
                        <p><strong>Members:</strong> {group.members?.length || 0}</p>
                      </div>
                    </div>
                    <div className="tooltip-container">
                      <button onClick={()=>joinGivenGroup(group)} className="action-button">
                        <UserRoundPlus />
                      </button>
                      <span className="tooltip-text">Join</span>
                    </div>
                  </div>
                ))
              ) : (
                <div>No Study Groups Found Matching Your Preferences...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
