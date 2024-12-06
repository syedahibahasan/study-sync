import React, { useState, useEffect } from "react";
import "./CreateGroupForm.css";
import {
  fetchEnrolledCourses,
  fetchPreferredLocations,
  fetchSchedule,
} from "../../services/userService";
import { createStudyGroup, saveStudyGroupTimes } from "../../services/groupServices";
import TimeSelector from "../TimeSelector/TimeSelector";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { useAuth } from "../../hooks/useauth";


export default function CreateGroupForm({ onCreateGroup, onClose, userId, loadMyGroups, loadMatchingGroups}) {
  const { createGroup } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [course, setCourse] = useState("");
  const [meetingType, setMeetingType] = useState("In-Person");
  const [location, setLocation] = useState("");
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);

  const [courses, setCourses] = useState([]);
  const [preferredLocations, setPreferredLocations] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [userSchedule, setUserSchedule] = useState([]); // User's busy times

  const transformScheduleForTimeSelector = (schedule) =>
    schedule.map(({ day, busyTimes = [] }) => ({ day, busyTimes }));

  const fetchData = useCallback(async () => {
    try {
      const coursesData = await fetchEnrolledCourses(userId);
      setCourses(coursesData);
  
      const locationsData = await fetchPreferredLocations(userId);
      setPreferredLocations(locationsData);
  
      const schedule = await fetchSchedule(userId);
      setUserSchedule(transformScheduleForTimeSelector(schedule));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [userId]); // Dependency array includes variables used inside
  
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Include fetchData as a dependency
  

  const handleSaveGroupTimes = async () => {
    if (selectedTimes.length === 0) {
      toast.error("Please select at least one time slot.");
      return;
    }
    try {
      await saveStudyGroupTimes(userId, selectedTimes);
      toast.success("Group times saved successfully!");
    } catch (error) {
      console.error("Error saving group times:", error);
      const errorMessage = error.response?.data?.message || "Failed to create the group. Please try again.";
      toast.error(error.response?.data?.message || "Failed to save group times. Please try again.");
    }
  };

  const groupTimesByDay = (times) => {
    const grouped = times.reduce((acc, { day, time }) => {
      const dayEntry = acc.find(item => item.day === day);
      if (dayEntry) {
        dayEntry.times.push(time);
      } else {
        acc.push({ day, times: [time] });
      }
      return acc;
    }, []);
    return grouped;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!groupName || !course || !selectedTimes.length || (meetingType === "In-Person" && !location)) {
      toast.error("Please fill all required fields");
      return;
    }
  
    const groupedSelectedTimes = groupTimesByDay(selectedTimes);
  
    try {
      await createGroup({
        groupName,
        course,
        meetingType,
        location: meetingType === "In-Person" ? location : "Online",
        selectedTimes: groupedSelectedTimes,
        userId,
      });
      toast.success("Study group created successfully!");
      await loadMyGroups();
      await loadMatchingGroups();
      onClose();
    } catch (error) {
      console.error("Error creating study group:", error);
      toast.error("Failed to create study group. Please try again.");
    }
  };
  
  
  const handleCloseSchedulePopup = () => setShowSchedulePopup(false);

  return (
    <div className="create-group-panel">
      <form onSubmit={handleSubmit}>
      <label className="group-name-section">
        <h3>Group Name:</h3>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          required
        />
      </label>
        <label>
          <h3>Select Course</h3>
          <select value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.course_title}
              </option>
            ))}
          </select>
        </label>

        <label>
          <h3>Select Meeting Time</h3>
          <button
            type="button"
            className="schedule-popup-button"
            onClick={() => setShowSchedulePopup(true)}
          >
            Open Schedule
          </button>
        </label>

        {showSchedulePopup && (
  <div className="schedule-popup">
      <div className="popup-close" onClick={handleCloseSchedulePopup}>×</div>
    <TimeSelector
      userSchedule={userSchedule}
      selectedTimes={selectedTimes}
      setSelectedTimes={setSelectedTimes}
      highlightType="group"
      editable={false}
      showSaveSchedule={false} // Hide Save Schedule button in this context
    />
    {/*<button
      className="save-schedule-button"
      onClick={handleSaveGroupTimes} // Call only the save schedule logic
    >
      Save Group Times
    </button>*/}
    {/* <button
      className="close-button"
      onClick={() => setShowSchedulePopup(false)}
    >
      Close
    </button> */}
  </div>
)}


<label>
  <h3>Is this an In-Person or Online Group?</h3>
  <div className="meeting-type-options">
    <label>
      <input
        type="radio"
        value="In-Person"
        checked={meetingType === "In-Person"}
        onChange={() => setMeetingType("In-Person")}
      />
      In-Person
    </label>
    <label>
      <input
        type="radio"
        value="Online"
        checked={meetingType === "Online"}
        onChange={() => setMeetingType("Online")}
      />
      Online
    </label>
  </div>
</label>


        {meetingType === "In-Person" && (
          <label>
            <h3>Campus Location</h3>
            <select value={location} onChange={(e) => setLocation(e.target.value)} required>
              <option value="">Select a location</option>
              {preferredLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="form-buttons">
          <button className="form-action-button" type="submit">
            Create Study Group
          </button>
          <button className="form-action-button cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
