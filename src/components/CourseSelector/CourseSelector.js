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

  // Load courses and categorize into available and saved lists
  const loadCourses = async () => {
    const courseList = await getCourses();
    if (user && user.enrolledCourses) {
      const userCourseIds = user.enrolledCourses.map((id) => id.toString());
      setSavedCourses(
        courseList.filter((course) =>
          userCourseIds.includes(course._id.toString())
        )
      );
      setAvailableCourses(
        courseList.filter(
          (course) => !userCourseIds.includes(course._id.toString())
        )
      );
    } else {
      setAvailableCourses(courseList);
      setSavedCourses([]);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [user]);

  // Add course to user and update lists
  const handleAddCourse = async (course) => {
    try {
      const response = await addCourse(user._id, course._id);
      setUser(response.user);
      await loadCourses();
      toast.success("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    }
  };

  // Remove course from user and update lists
  const handleRemoveCourse = async (course) => {
    try {
      const response = await removeCourse(user._id, course._id);
      setUser(response.user);
      await loadCourses();
      toast.success("Course removed successfully!");
    } catch (error) {
      console.error("Error removing course:", error);
      toast.error("Failed to remove course");
    }
  };

  // Filter available courses based on search term (by course name or course code)
  const filteredCourses = availableCourses
    .filter(
      (course) =>
        course.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, MAX_COURSES);

  // Display 20 courses maximum for the query
  const displayCourses = searchTerm
    ? filteredCourses
    : availableCourses.slice(0, MAX_COURSES);

  return (
    <div className="course-selector-container">
      {/* Available Courses Section */}
      <div className="available-courses-section">
        <label>Available Courses:</label>
        <div className="course-search-bar">
          <input
            type="text"
            placeholder="      Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="course-search-input"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <div className="course-list-container">
          <ul className="course-list">
            {filteredCourses.map((course) => (
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
