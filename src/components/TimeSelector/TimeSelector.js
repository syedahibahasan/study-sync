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
    const { saveSchedule, fetchSchedule, saveGroupSchedule } = useAuth();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const times = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
        "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", 
        "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM"];

    const [userTimes, setUserTimes] = useState(new Array(days.length * times.length).fill(false));
    const [mousePressed, setMousePressed] = useState(false);

    useEffect(() => {
        if (highlightType === "busy") {
            loadBusySchedule(); // Ensure correct function call
        }
    }, [highlightType]);

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
        const tempUserTimes = new Array(days.length * times.length).fill(false);
        schedule.forEach(({ day, busyTimes }) => {
            const dayIndex = days.indexOf(day);
            busyTimes.forEach((time) => {
                const timeIndex = times.indexOf(time);
                if (dayIndex !== -1 && timeIndex !== -1) {
                    tempUserTimes[dayIndex * times.length + timeIndex] = true;
                }
            });
        });
        setUserTimes(tempUserTimes); // Update state with loaded schedule
    };

    // const isBusyTime = (rowIndex, columnIndex) => userTimes[columnIndex * times.length + rowIndex];
    const isBusyTime = (rowIndex, columnIndex) => {
        if (editable) {
          return userTimes[columnIndex * times.length + rowIndex]; // Editable in UserProfile
        } else {
          const day = days[columnIndex];
          const time = times[rowIndex];
          return userSchedule.some(
            (entry) => entry.day === day && entry.busyTimes.includes(time)
          ); // Non-editable in CreateGroupForm
        }
      };
      

      
    const isGroupTime = (rowIndex, columnIndex) => selectedTimes.some(
        (time) => time.day === days[columnIndex] && time.time === times[rowIndex]
    );

    const toggleBusyTime = (rowIndex, columnIndex) => {
        if (highlightType !== "busy") return; // Ensure only busy times can be toggled
        const tempUserTimes = [...userTimes];
        tempUserTimes[columnIndex * times.length + rowIndex] = !tempUserTimes[columnIndex * times.length + rowIndex];
        setUserTimes(tempUserTimes);
    };

    const toggleGroupTime = (rowIndex, columnIndex) => {
        if (highlightType === "group" && isBusyTime(rowIndex, columnIndex)) return; // Prevent modifying busy times
        const time = { day: days[columnIndex], time: times[rowIndex] };
        const updatedTimes = isGroupTime(rowIndex, columnIndex)
            ? selectedTimes.filter((t) => !(t.day === time.day && t.time === time.time))
            : [...selectedTimes, time];
        setSelectedTimes(updatedTimes);
    };

    const handleSaveSchedule = () => {
        if (highlightType === "busy") {
            // Save busy times
            const schedule = formatUserTimesForDatabase();
            saveSchedule(schedule);
        } else if (highlightType === "group") {
            // Save group times
            const groupTimes = selectedTimes.map(({ day, time }) => ({ day, time }));
            saveGroupSchedule(groupTimes); // Ensure this function is defined to handle group times
        } else {
            console.warn("Unsupported highlightType:", highlightType);
        }
    };
    
    

    const formatUserTimesForDatabase = () => {
        return days.map((day, dayIndex) => ({
            day,
            busyTimes: times.filter((_, timeIndex) => userTimes[dayIndex * times.length + timeIndex]),
        }));
    };

    useEffect(() => {
        document.addEventListener("mousedown", () => setMousePressed(true));
        document.addEventListener("mouseup", () => setMousePressed(false));
        return () => {
            document.removeEventListener("mousedown", () => setMousePressed(true));
            document.removeEventListener("mouseup", () => setMousePressed(false));
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
                    Group Time
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
                                onMouseDown={() => (highlightType === "busy" ? toggleBusyTime(rowIndex, columnIndex) : toggleGroupTime(rowIndex, columnIndex))}
                                onMouseOver={() => mousePressed && (highlightType === "busy" ? toggleBusyTime(rowIndex, columnIndex) : toggleGroupTime(rowIndex, columnIndex))}
                                className={
                                    isBusyTime(rowIndex, columnIndex)
                                        ? "time-item cell busy-time"
                                        : isGroupTime(rowIndex, columnIndex)
                                            ? "time-item cell group-time"
                                            : "time-item cell"
                                }
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
            {/* Conditionally render Save Schedule button */}
            {showSaveSchedule && (
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
