import React, { useEffect, useState } from "react";
import { getCourses } from "../../services/courseService";
import { addCourse, removeCourse } from "../../services/userService";
import { toast } from "react-toastify";
import "./CourseSelector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const CourseSelector = ({ user, setUser }) => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const MAX_COURSES = 20;

  // Fetch and categorize courses
  async function loadCourses(){
    try {
      const courseList = await getCourses();
      const userCourseIds = user?.enrolledCourses || [];
      setAvailableCourses(
        courseList.filter((course) => !userCourseIds.includes(course._id))
      );
      setSavedCourses(
        courseList.filter((course) => userCourseIds.includes(course._id))
      );
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Add course and update state
  const handleAddCourse = async (course) => {
    try {
      await addCourse(user._id, course._id);
      setSavedCourses((prev) => [...prev, course]);
      setAvailableCourses((prev) =>
        prev.filter((availableCourse) => availableCourse._id !== course._id)
      );
      toast.success("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    }
  };

  // Remove course and update state
  const handleRemoveCourse = async (course) => {
    try {
      await removeCourse(user._id, course._id);
      setAvailableCourses((prev) => [...prev, course]);
      setSavedCourses((prev) =>
        prev.filter((savedCourse) => savedCourse._id !== course._id)
      );
      toast.success("Course removed successfully!");
    } catch (error) {
      console.error("Error removing course:", error);
      toast.error("Failed to remove course");
    }
  };

  // Filter courses for display
  const filteredCourses = availableCourses.filter(
    (course) =>
      course.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="course-selector-container">
      {/* Available Courses Section */}
      <div className="available-courses-section">
        <label>Available Courses:</label>
        <div className="course-search-bar">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="course-search-input"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <div className="course-list-container">
          <ul className="course-list">
            {filteredCourses.slice(0, MAX_COURSES).map((course) => (
              <li key={course._id} className="course-list-item">
                {course.section} ({course.course_title})
                <button
                  className="add-button"
                  onClick={() => handleAddCourse(course)}
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Saved Courses Section */}
      <div className="saved-courses-section">
        <label>My Courses:</label>
        <div className="saved-courses-box">
          {savedCourses.length === 0 ? (
            <p className="placeholder-text">No courses added yet</p>
          ) : (
            <ul className="course-list">
              {savedCourses.map((course) => (
                <li key={course._id} className="course-list-item">
                  {course.section} ({course.course_title})
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveCourse(course)}
                  >
                    -
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseSelector;
