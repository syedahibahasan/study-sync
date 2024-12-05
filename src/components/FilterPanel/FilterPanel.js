import React, { useState, useEffect } from "react";
import "./FilterPanel.css";
import { useAuth } from "../../hooks/useauth";

export default function FilterPanel({ isOpen, onFilterChange }) {
  const { fetchEnrolledCourses, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    onFilterChange(selectedCourses);
  }, [selectedCourses, onFilterChange]);

  return (
    <div
      id="filter-panel"
      className={`filter-panel ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
    >
      <h4>Filter by Courses 📚:</h4>

      {loading && <p>Loading courses...</p>}
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

      <h4>Filter by Time ⌚:</h4>
      <h4>Filter by Location 📍:</h4>
    </div>
  );
}
