import React, { useState } from 'react';
import { Plus, UserRoundPlus, Filter } from 'lucide-react';
import './UserDashboard.css';

export default function UserDashboard() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateGroupPanelOpen, setIsCreateGroupPanelOpen] = useState(false);
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']; //example for testing, fix later
  const [checkedItems, setCheckedItems] = useState({});
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const api = ""; //add backend url
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim() && groupDescription.trim()) {
      createGroup({ name: groupName, description: groupDescription });
      alert("Submitted");
      toggleCreateGroupPanel();
    } else {
      alert("Please fill in all fields");
    }
  };

  const createGroup = async (groupData) => {
    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
      });
      const newGroup = await response.json(); //idk if we need the response, we could just redirect the user to groupchat after the group is created
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  return (
    <div className="container">
      {/* sidebar */}
      <div className="sidebar-container">
        <span className="sidebar-title">My Study Groups</span>
        {['Group 1', 'Group 2', 'Group 3'].map((group) => (
        <div key={group} className="sidebar-item">
            <span>{group}</span>
        </div>
        ))}
      </div>

      {/* main section */}
      <div className="main-content">
        {/* header */}
        <div className="header-container">
          <div className="group-search-bar">
            <input type="text" placeholder="Search" />
            {/* filter */}
          <button className="filter-button"  onClick={toggleFilter}><Filter/></button>
          {isFilterOpen ? 
            <div className="panel">
              <h3>Filter by:</h3>
              <div className="filter-list">
                <label>
                  Class
                  <input
                    type="checkbox"
                    name="class"
                    onChange={handleCheckboxChange}
                  />
                </label>
                <label>
                  Time
                  <input
                    type="checkbox"
                    name="class"
                    onChange={handleCheckboxChange}
                  />
                </label>
                <label>
                  Location
                  <input
                    type="checkbox"
                    name="class"
                    onChange={handleCheckboxChange}
                  />
                </label>
              </div>
            </div> 
          : <></>}
          {/* create group */}
          <button className="action-button" onClick={toggleCreateGroupPanel}><Plus/> Create Group</button>
          {isCreateGroupPanelOpen ? 
            <div className="create-group-panel">
              <form>
                <label>
                  <h3>Group Name</h3>
                  <input type="text" name="name" placeholder="Enter a name" onChange={(e) => setGroupName(e.target.value)} />
                </label>
                <label>
                  <h3>Group Description</h3>
                  <input type="text" name="description" placeholder="Class, Location, Time" onChange={(e) => setGroupDescription(e.target.value)} />
                </label>
              </form>
              <button className="action-button" onClick={handleSubmit}>Create</button>
            </div> 
          : <></>}
          </div>
        </div>
        
        {/* available groups list */}
        <div className="group-list">
          <h3 className="group-list-title">Available Study Groups</h3>
          {[1, 2, 3].map((group) => ( //example for testing, fix later
            <div key={group} className="group-item">
                <div>
                    <div className="group-name">Group {group}</div>
                    <div className="group-item-description">Description</div>
                </div>
                <button className="action-button"><UserRoundPlus /> Join</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}