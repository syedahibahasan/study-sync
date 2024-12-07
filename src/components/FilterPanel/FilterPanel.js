import React, { useState, useEffect } from "react";
import "./FilterPanel.css";
import { useAuth } from "../../hooks/useauth";

export default function FilterPanel({ isOpen, onFilterChange }) {
  const { fetchEnrolledCourses, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM", "9:00 PM"
  ];

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchCourses = async () => {
    if (!user || !user._id) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const enrolledCourses = await fetchEnrolledCourses(user._id);
      setCourses(enrolledCourses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message || "An error occurred while fetching courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (courseId) => {
    setSelectedCourses((prevSelected) => {
      let updatedSelected;
      if (prevSelected.includes(courseId)) {
        updatedSelected = prevSelected.filter((id) => id !== courseId);
      } else {
        updatedSelected = [...prevSelected, courseId];
      }
      return updatedSelected;
    });
  };

  const handleDayCheckboxChange = (day) => {
    setSelectedDays((prevSelected) => {
      if (prevSelected.includes(day)) {
        return prevSelected.filter((d) => d !== day);
      } else {
        return [...prevSelected, day];
      }
    });
  };

  const handleTimeCheckboxChange = (time) => {
    setSelectedTimes((prevSelected) => {
      if (prevSelected.includes(time)) {
        return prevSelected.filter((t) => t !== time);
      } else {
        return [...prevSelected, time];
      }
    });
  };

  const handleLocationCheckboxChange = (location) => {
    setSelectedLocations((prevSelected) => {
      let updatedSelected;
      if (prevSelected.includes(location)) {
        updatedSelected = prevSelected.filter((loc) => loc !== location);
      } else {
        updatedSelected = [...prevSelected, location];
      }
      return updatedSelected;
    });
  };

  useEffect(() => {
    onFilterChange({
      courses: selectedCourses,
      locations: selectedLocations,
      days: selectedDays,
      times: selectedTimes,
    });
  }, [selectedCourses, selectedLocations, selectedDays, selectedTimes, onFilterChange]);

  return (
    <div
      id="filter-panel"
      className={`filter-panel ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
    >
      {/* Courses Filter */}
      <h4>Filter by Courses 📚:</h4>
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="filter-list">
          {courses.length > 0 ? (
            <div className="courses-container">
              {courses.map((course) => (
                <label key={course.id || course._id} className="course-label">
                  <span className="course-name">{course.course_title}</span>
                  <input
                    type="checkbox"
                    name={course.name}
                    checked={selectedCourses.includes(course.id || course._id)}
                    onChange={() => handleCheckboxChange(course.id || course._id)}
                  />
                </label>
              ))}
            </div>
          ) : (
            <p>No enrolled courses found.</p>
          )}
        </div>
      )}

      {/* Time Filter */}
      <div className="filter-section">
        <h4>Filter by Time ⌚:</h4>
        <div className="filter-list">
          <div className="times-container">
            {timeSlots.map((time) => (
              <label key={time} className="time-label">
                <span className="time-name">{time}</span>
                <input
                  type="checkbox"
                  checked={selectedTimes.includes(time)}
                  onChange={() => handleTimeCheckboxChange(time)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Days Filter */}
      <div className="filter-section">
        <h4>Filter by Day 📅:</h4>
        <div className="filter-list">
          {daysOfWeek.length > 0 ? (
            <div className="days-container">
              {daysOfWeek.map((day) => (
                <label key={day} className="day-label">
                  <span className="day-name">{day}</span>
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayCheckboxChange(day)}
                  />
                </label>
              ))}
            </div>
          ) : (
            <p>No days available for filtering.</p>
          )}
        </div>
      </div>

      {/* Locations Filter */}
      <h4>Filter by Location 📍:</h4>
      <div className="filter-list">
        {user.preferredLocations && user.preferredLocations.length > 0 ? (
          <div className="locations-container">
            {user.preferredLocations.map((location) => (
              <label key={location} className="location-label">
                <span className="location-name">{location}</span>
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location)}
                  onChange={() => handleLocationCheckboxChange(location)}
                />
              </label>
            ))}
          </div>
        ) : (
          <p>No preferred locations found.</p>
        )}
      </div>
    </div>
  );
}
