import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import CreateGroupForm from "../../components/CreateGroupForm/CreateGroupForm";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import SearchBar from "../../components/SearchBar/SearchBar";
import ChatGroup from "../../components/ChatGroup/ChatGroup";
import { Plus, UserRoundPlus, Filter } from "lucide-react";
import "./UserDashboard.css";
import { useAuth } from "../../hooks/useauth.js";

export default function UserDashboard() {
  const { user, fetchMatchingGroups, fetchMyGroups, createGroup, joinGroup } = useAuth();
  const userId = user?._id;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateGroupPanelOpen, setIsCreateGroupPanelOpen] = useState(false);
  const [allMatchingGroups, setAllMatchingGroups] = useState([]);
  const [matchingGroups, setMatchingGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  
  const { groupId: selectedGroupId } = useParams(); // This will give the currently selected group ID
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    loadMatchingGroups();
    loadMyGroups();
  }, []);

  async function loadMatchingGroups() {
    try {
      const groups = await fetchMatchingGroups(userId);
      setAllMatchingGroups(groups.matchingGroups || []);
      setMatchingGroups(groups.matchingGroups || []);
    } catch (error) {
      console.error("Error fetching matching groups:", error);
    }
  }

  async function loadMyGroups() {
    const groups = await fetchMyGroups();
    setMyGroups(groups.myGroups || []);
  }
  

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const toggleCreateGroupPanel = () => setIsCreateGroupPanelOpen(!isCreateGroupPanelOpen);

  const joinGivenGroup = async (groupData) => {
    try {
      await joinGroup(groupData);
      await loadMyGroups();
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const actionCreateGroup = async (groupData) => {
    await createGroup(groupData);
    await loadMyGroups(); // Refresh "My Study Groups"
    await loadMatchingGroups(); // Refresh "Available Study Groups" if necessary
  };
  
  const handleGroupClick = (groupId) => {
    navigate(`/userdashboard/${groupId}`); // Navigate to the group
  };

  const GroupSidebar = () => (
    <div className="sidebar-container">
      <span className="sidebar-title">My Study Groups</span>
      {myGroups && myGroups.length > 0 ? (
        myGroups.map((group) => (
          <div
            key={group._id}
            className={`sidebar-item ${group._id === selectedGroupId ? "selected" : ""}`} // Highlight selected group
            onClick={() => handleGroupClick(group._id)}
          >
            <span>{group.name || "Untitled Group"}</span>
          </div>
        ))
      ) : (
        <div>No Groups Available</div>
      )}
    </div>
  );

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleFilterChange = useCallback(({ courses, locations, days, times }) => {
    setSelectedCourses(courses);
    setSelectedLocations(locations);
    setSelectedDays(days);
    setSelectedTimes(times);
  }, []);

  useEffect(() => {
    let filtered = allMatchingGroups;

    if (selectedCourses.length > 0) {
      filtered = filtered.filter((group) =>
        selectedCourses.includes(group.courseId)
      );
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((group) =>
        selectedLocations.includes(group.location)
      );
    }

   if (selectedDays.length > 0) {
    filtered = filtered.filter((group) =>
      Array.isArray(group.selectedTimes) && group.selectedTimes.some((meeting) =>
        selectedDays.includes(meeting.day)
      )
    );
  }

  if (selectedTimes.length > 0) {
    filtered = filtered.filter((group) =>
      Array.isArray(group.selectedTimes) && group.selectedTimes.some((meeting) =>
        Array.isArray(meeting.times) && meeting.times.every((time) =>
          selectedTimes.includes(time)
        )
      )
    );
  }

  if (searchKeyword.trim() !== "") {
    const keyword = searchKeyword.toLowerCase();
    filtered = filtered.filter((group) => {
      const nameMatch = group.name.toLowerCase().includes(keyword);
      const courseNameMatch = group.courseName.toLowerCase().includes(keyword);
      const locationMatch = group.location.toLowerCase().includes(keyword);
      
      const timesMatch = group.selectedTimes.some((meeting) => {
        const dayMatch = meeting.day.toLowerCase().includes(keyword);
        const timeMatch = meeting.times.some((time) =>
          time.toLowerCase().includes(keyword)
        );
        return dayMatch || timeMatch;
      });
      
      return nameMatch || courseNameMatch || locationMatch || timesMatch;
    });
  }

    setMatchingGroups(filtered);
  }, [selectedCourses, selectedLocations, selectedDays, selectedTimes, searchKeyword, allMatchingGroups]);
  

  return (
    <div className="container">
      <GroupSidebar />
      
      <div className="main-content">
      <Routes>
  <Route
    path="/"
    element={
      <div>
        <div className="header-container">
          <div className="group-search-bar">
            <SearchBar onSearch={handleSearch} />
            <div className="tooltip-container">
              <button
                className="filter-button"
                onClick={toggleFilter}
                aria-label="Filter groups"
              >
                <Filter />
              </button>
              <span className="tooltip-text">Filter</span>
            </div>
            
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

        <FilterPanel
          isOpen={isFilterOpen}
          onFilterChange={handleFilterChange}
        />

        {isCreateGroupPanelOpen && (
          <CreateGroupForm
            onCreateGroup={actionCreateGroup}
            onClose={toggleCreateGroupPanel}
            userId={userId}
            loadMyGroups={fetchMyGroups}
            loadMatchingGroups={fetchMatchingGroups}
          />
        )}
        <div className="group-list">
          <h3 className="group-list-title">Available Study Groups</h3>
          {matchingGroups && matchingGroups.length > 0 ? (
            matchingGroups.map((group) => (
              <div key={group._id} className="group-item">
                <div>
                  <div className="group-name">{group.name}</div>
                  <div className="group-item-description">
                    <b>Course: </b>{group.courseName} <br></br>
                    <b>Location: </b> {group.location} <br></br> 
                    <b>Times: </b> {group.selectedTimes.map(({ day, times }, index) => (
                      <span key={index}>
                        {day}: {times[0]} to {times[times.length - 1]}
                        {index < group.selectedTimes.length - 1 ? '; ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="tooltip-container">
                  <button
                    onClick={() => joinGivenGroup(group)}
                    className="action-button"
                  >
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
    }
  />
  <Route path=":groupId/*" element={<ChatGroup />} /> {/* Add the `/*` to ensure nested routes */}
</Routes>


      </div>
    </div>
  );
}
