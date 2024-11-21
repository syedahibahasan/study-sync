import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../hooks/useauth"; // Use Auth Context
import { getCourses } from "../../services/courseService";
import { toast } from "react-toastify";
import "./CourseSelector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const CourseSelector = React.memo(() => {
  const { fetchEnrolledCourses, saveEnrolledCourses } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initializeCourses = async () => {
      try {
        const courseList = await getCourses();
        const enrolledCourses = await fetchEnrolledCourses();

        setAllCourses(courseList); // Store all courses
        setSavedCourses(enrolledCourses); // Store saved courses
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load courses");
      }
    };

    initializeCourses();
  }, []); // Run only once on mount

  const availableCourses = useMemo(
    () =>
      allCourses.filter(
        (course) => !savedCourses.some((saved) => saved._id === course._id)
      ),
    [allCourses, savedCourses]
  );

  const handleAddCourse = async (course) => {
    try {
      await saveEnrolledCourses(course, "added");

      // Update only the affected lists
      setSavedCourses((prev) => [...prev, course]);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleRemoveCourse = async (course) => {
    try {
      await saveEnrolledCourses(course, "removed");

      // Update only the affected lists
      setSavedCourses((prev) =>
        prev.filter((savedCourse) => savedCourse._id !== course._id)
      );
    } catch (error) {
      console.error("Error removing course:", error);
    }
  };

  const filteredCourses = useMemo(
    () =>
      availableCourses.filter(
        (course) =>
          course.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [availableCourses, searchTerm]
  );

  return (
    <div className="course-selector-container">
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
});

export default CourseSelector;
