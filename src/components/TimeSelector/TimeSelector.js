import React, { useEffect, useState } from 'react';
import { useAuth } from "../../hooks/useauth";

import "./TimeSelector.css";

const TimeSelector = ({
    userSchedule = [], // Array of busy times from the backend
    selectedTimes = [], // Array for group times
    setSelectedTimes = () => {}, // Function to update selected group times
    highlightType = "busy", // Default to busy time selector
    editable = false, // Default to false if not provided
    showSaveSchedule = true, // Control visibility of Save Schedule button
}) => {
    const { saveSchedule, fetchSchedule, saveGroupSchedule, fetchEnrolledCourses } = useAuth();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const times = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
        "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", 
        "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM"];

    const [mousePressed, setMousePressed] = useState(false);
    const [busyTimesState, setBusyTimesState] = useState(new Array(days.length * times.length).fill(false));
    const [studyGroupTimesState, setStudyGroupTimesState] = useState(new Array(days.length * times.length).fill(false));

    useEffect(() => {
        loadBusySchedule();
    }, []);

    const loadBusySchedule = async () => {
        try {
            const schedule = await fetchSchedule();
            if (!Array.isArray(schedule)) {
                console.error("Invalid schedule format:", schedule);
                return;
            }
            updateScheduleState(schedule);
        } catch (error) {
            console.error("Failed to load schedule:", error);
        }
    };

    const updateScheduleState = (schedule) => {
        const tempBusyTimes = new Array(days.length * times.length).fill(false);
        const tempStudyGroupTimes = new Array(days.length * times.length).fill(false);

        schedule.forEach(({ day, busyTimes = [], studyGroupTime = [] }) => {
            const dayIndex = days.indexOf(day);

            busyTimes.forEach((time) => {
                const timeIndex = times.indexOf(time);
                if (dayIndex !== -1 && timeIndex !== -1) {
                    tempBusyTimes[dayIndex * times.length + timeIndex] = true;
                }
            });

            studyGroupTime.forEach((time) => {
                const timeIndex = times.indexOf(time);
                if (dayIndex !== -1 && timeIndex !== -1) {
                    tempStudyGroupTimes[dayIndex * times.length + timeIndex] = true;
                }
            });
        });

        setBusyTimesState(tempBusyTimes);
        setStudyGroupTimesState(tempStudyGroupTimes);
    };

    const isBusyTime = (rowIndex, columnIndex) => {
        return busyTimesState[columnIndex * times.length + rowIndex];
    };

    const isStudyGroupTime = (rowIndex, columnIndex) => {
        return studyGroupTimesState[columnIndex * times.length + rowIndex];
    };

    const isSelectedGroupTime = (rowIndex, columnIndex) => {
        return selectedTimes.some(
            (time) => time.day === days[columnIndex] && time.time === times[rowIndex]
        );
    };

    const toggleBusyTime = (rowIndex, columnIndex) => {
        if (highlightType !== "busy") return;
        const index = columnIndex * times.length + rowIndex;
        const tempBusyTimes = [...busyTimesState];
        tempBusyTimes[index] = !tempBusyTimes[index];
        setBusyTimesState(tempBusyTimes);
    };

    const toggleGroupTime = (rowIndex, columnIndex) => {
        if (isBusyTime(rowIndex, columnIndex) || isStudyGroupTime(rowIndex, columnIndex)) return;

        const time = { day: days[columnIndex], time: times[rowIndex] };
        const updatedTimes = isSelectedGroupTime(rowIndex, columnIndex)
            ? selectedTimes.filter((t) => !(t.day === time.day && t.time === time.time))
            : [...selectedTimes, time];
        setSelectedTimes(updatedTimes);
    };

    const handleSaveSchedule = () => {
        if (highlightType === "busy") {
            const schedule = formatUserTimesForDatabase();
            saveSchedule(schedule);
        } else {
            console.warn("Unsupported highlightType:", highlightType);
        }
    };

    const formatUserTimesForDatabase = () => {
        return days.map((day, dayIndex) => {
            const busyTimes = times.filter((_, timeIndex) => busyTimesState[dayIndex * times.length + timeIndex]);
            const studyGroupTime = times.filter((_, timeIndex) => studyGroupTimesState[dayIndex * times.length + timeIndex]);
            return {
                day,
                busyTimes,
                studyGroupTime,
            };
        });
    };

    useEffect(() => {
        const handleMouseDown = () => setMousePressed(true);
        const handleMouseUp = () => setMousePressed(false);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div className="time-selector-wrapper">
            {/* Legend */}
            <div className="legend-container">
                <div className="legend-item">
                    <div className="legend-circle busy-time"></div>
                    Busy Time
                </div>
                <div className="legend-item">
                    <div className="legend-circle group-time"></div>
                    Study Group Time
                </div>
                <div className="legend-item">
                    <div className="legend-circle course-time"></div>
                    Course Time
                </div>
            </div>

            <div className="time-container">
                <div className="time-item header">Time / Day</div>
                {days.map((day, index) => (
                    <div key={`${index}`} className="time-item header">{day}</div>
                ))}

                {times.map((time, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                        <div key={`time-${rowIndex}`} className="time-item time">{time}</div>
                        {days.map((_, columnIndex) => (
                            <div
                                key={`cell-${rowIndex}-${columnIndex}`}
                                onMouseDown={() => {
                                    if (editable && highlightType === "busy") {
                                        toggleBusyTime(rowIndex, columnIndex);
                                    } else if (highlightType === "group") {
                                        toggleGroupTime(rowIndex, columnIndex);
                                    }
                                }}
                                onMouseOver={() => {
                                    if (mousePressed) {
                                        if (editable && highlightType === "busy") {
                                            toggleBusyTime(rowIndex, columnIndex);
                                        } else if (highlightType === "group") {
                                            toggleGroupTime(rowIndex, columnIndex);
                                        }
                                    }
                                }}
                                className={
                                    isBusyTime(rowIndex, columnIndex) && isStudyGroupTime(rowIndex, columnIndex)
                                        ? "time-item cell both-times"
                                        : isBusyTime(rowIndex, columnIndex)
                                            ? "time-item cell busy-time"
                                            : isStudyGroupTime(rowIndex, columnIndex)
                                                ? "time-item cell group-time"
                                                : isSelectedGroupTime(rowIndex, columnIndex)
                                                    ? "time-item cell selected-group-time"
                                                    : "time-item cell"
                                }
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
            {/* Conditionally render Save Schedule button */}
            {showSaveSchedule && editable && (
                <>
                    <button onClick={handleSaveSchedule} className="save-schedule-button"> 
                        Save Schedule 
                    </button>
                    <button onClick={loadBusySchedule} className="refresh-schedule-button">
                        Refresh Schedule
                    </button>
                </>
            )}
        </div>
    );
};

export default TimeSelector;