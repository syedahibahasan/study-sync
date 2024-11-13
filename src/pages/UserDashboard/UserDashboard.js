import React, { useState } from 'react';
import { Plus, UserRoundPlus, Filter } from 'lucide-react';
import './UserDashboard.css';

export default function UserDashboard() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  const [checkedItems, setCheckedItems] = useState({});
  
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: checked,
    }));
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
          <button className="filter-button"  onClick={togglePanel}><Filter/>
          </button>
          {isPanelOpen ? 
            <div className="panel">
              <h3>Filter by:</h3>
              {items.map((item, index) => (
                <div key={index}>
                  <label>
                    <input
                      type="checkbox"
                      name={item}
                      checked={checkedItems[item] || false}
                      onChange={handleCheckboxChange}
                    />
                    {item}
                  </label>
                </div>
              ))}
            </div> 
          : <></>}
          <button className="action-button"><Plus/> Create Group</button>
          </div>
        </div>
        
        {/* available groups list */}
        <div className="group-list">
          <h3 className="group-list-title">Available Study Groups</h3>
          {[1, 2, 3].map((group) => (
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