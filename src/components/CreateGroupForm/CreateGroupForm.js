import React, { useState, useEffect } from "react";
import "./CreateGroupForm.css";
import { fetchEnrolledCourses, fetchSchedule, fetchPreferredLocations } from "../../services/userService";
import Modal from "react-modal";
import TimeSelector from "../TimeSelector/TimeSelector";

export default function CreateGroupForm({ onCreateGroup, onClose, userId }) {
  const [groupName, setGroupName] = useState("");
  const [course, setCourse] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingType, setMeetingType] = useState("In-Person");
  const [location, setLocation] = useState("");

  // Dynamic data states
  const [courses, setCourses] = useState([]);
  const [suggestedTimes, setSuggestedTimes] = useState([]);
  const [preferredLocations, setPreferredLocations] = useState([]);
  const [isTimeSelectorOpen, setIsTimeSelectorOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchData();
    } else {
      console.error("No userId provided.");
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      const coursesData = await fetchEnrolledCourses(userId);
      setCourses(coursesData);

      const scheduleData = await fetchSchedule(userId);
      // Filter schedule for empty slots
      const availableTimes = [];
      scheduleData.forEach((entry) => {
        if (entry.busyTimes.length === 0) {
          availableTimes.push(`${entry.day}: Free All Day`);
        } else {
          // Optionally process busy times into free slots
        }
      });
      setSuggestedTimes(availableTimes);

      const locationsData = await fetchPreferredLocations(userId);
      setPreferredLocations(locationsData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim() && course && meetingTime && meetingType && (meetingType === "Online" || location)) {
      onCreateGroup({
        groupName,
        course,
        meetingTime,
        meetingType,
        location: meetingType === "In-Person" ? location : "Online",
      });
      onClose();
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="create-group-panel">
      <form onSubmit={handleSubmit}>

        {/* Select Course */}
        <label>
          <h3>Select Course</h3>
          <select value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.course_title} {/* Adjusted key */}
              </option>
            ))}
          </select>
        </label>

        {/* Select Meeting Time */}
        <label>
          <h3>Select Meeting Time</h3>
          <h4>Select time from time schedule</h4>
          <button
            type="button"
            className="open-time-selector-button"
            onClick={() => setIsTimeSelectorOpen(true)}
          >
            Open Time Selector
          </button>
          <h4>Or</h4>
          <h4>Suggested times based on your schedule:</h4>
          <select value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} required>
            <option value="">Select a time</option>
            {suggestedTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>

        {/* In-Person or Online */}
        <label>
          <h3>Is this an In-Person or Online Group?</h3>
          <div>
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

        {/* Location */}
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

        {/* Buttons */}
        <div className="form-buttons">
          <button className="form-action-button" type="submit">
            Create Study Group
          </button>
          <button className="form-action-button cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>

      {/* Modal for TimeSelector */}
      <Modal
        isOpen={isTimeSelectorOpen}
        onRequestClose={() => setIsTimeSelectorOpen(false)}
        className="time-selector-modal"
        overlayClassName="time-selector-overlay"
      >
        <h2>Time Selector</h2>
        <TimeSelector type="study" />
        <button
          className="close-time-selector-button"
          onClick={() => setIsTimeSelectorOpen(false)}
        >
          Close
        </button>
      </Modal>

    </div>
  );
}
