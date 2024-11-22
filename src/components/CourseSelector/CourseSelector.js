import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../hooks/useauth";
import { getCourses } from "../../services/courseService";
import { toast } from "react-toastify";
import "./CourseSelector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const CourseSelector = () => {
  const { fetchEnrolledCourses, saveEnrolledCourses } = useAuth();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const MAX_COURSES = 20;

  useEffect(() => {
    const initializeCourses = async () => {
      try {
        const enrolledCourses = await fetchEnrolledCourses();
        setSavedCourses(enrolledCourses); // Only saved courses need to be fetched initially

        const courseList = await getCourses(); // Fetch all courses initially
        setAvailableCourses(
          courseList.filter(
            (course) => !enrolledCourses.some((saved) => saved._id === course._id)
          )
        );
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load courses");
      }
    };

    initializeCourses();
  }, []);

  // Handle search dynamically
  const handleSearch = useCallback(async (term) => {
    try {
      const filteredCourses = await getCourses(term); // Fetch courses matching the search term
      setAvailableCourses(
        filteredCourses.filter(
          (course) => !savedCourses.some((saved) => saved._id === course._id)
        )
      );
    } catch (error) {
      console.error("Error searching courses:", error);
      toast.error("Failed to search courses");
    }
  }, [savedCourses]);

  useEffect(() => {
    handleSearch(searchTerm); // Trigger search whenever the search term changes
  }, [searchTerm, handleSearch]);

  const handleAddCourse = async (course) => {
    try {
      await saveEnrolledCourses(course, "added");
      setSavedCourses((prev) => [...prev, course]); // Add locally
      setAvailableCourses((prev) =>
        prev.filter((availableCourse) => availableCourse._id !== course._id)
      ); // Remove locally
      toast.success("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    }
  };

  const handleRemoveCourse = async (course) => {
    try {
      await saveEnrolledCourses(course, "removed");
      setAvailableCourses((prev) => [...prev, course]); // Add locally
      setSavedCourses((prev) =>
        prev.filter((savedCourse) => savedCourse._id !== course._id)
      ); // Remove locally
      toast.success("Course removed successfully!");
    } catch (error) {
      console.error("Error removing course:", error);
      toast.error("Failed to remove course");
    }
  };

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
            {availableCourses.slice(0, MAX_COURSES).map((course) => (
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
};

export default CourseSelector;
