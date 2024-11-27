import React, { useEffect, useState } from 'react';
import { useAuth } from "../../hooks/useauth";

import "./TimeSelector.css";

const TimeSelector = ({ 
    type, 
    initialSelectedTimes = [], // For 'study' type
    onChange, // Callback for 'study' type to pass selected times up
}) => {
    const { saveSchedule, fetchSchedule } = useAuth();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const times = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
        "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", 
        "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM"];

    // const [userTimes, setUserTimes] = useState(new Array(days.length * times.length).fill(false));

    // Different times for different type
    const [busyTimes, setBusyTimes] = useState(new Array(days.length * times.length).fill(false));
    const [studyTimes, setStudyTimes] = useState(new Array(days.length * times.length).fill(false));
    
    const [mousePressed, setMousePressed] = useState(false);

    // Effect to handle intialization based on type
    useEffect(() => {
        if (type === 'busy') {
            loadBusySchedule();
        } else if (type === 'study') {
            loadBusySchedule();
            initializeStudyTimes();
        }
        setMousePressed(false);
    }, [type]);

    async function loadSchedule(){
        const loadSchedule = await fetchSchedule();
        updateScheduleState(loadSchedule);
    };

    const loadBusySchedule = async () => {
        try {
            const schedule = await fetchSchedule();
            if (schedule && Array.isArray(schedule)) {
                const tempBusyTimes = new Array(days.length * times.length).fill(false);
                schedule.forEach(({ day, busyTimes }) => {
                    const dayIndex = days.indexOf(day);
                    if (dayIndex === -1) return;

                    busyTimes.forEach((time) => {
                        const timeIndex = times.indexOf(time);
                        if (timeIndex !== -1) {
                            const index = dayIndex * times.length + timeIndex;
                            tempBusyTimes[index] = true;
                        }
                    });
                });
                setBusyTimes(tempBusyTimes);
            } else {
                console.error("Invalid schedule data:", schedule);
            }
        } catch (error) {
            console.error("Error loading busy schedule:", error);
        }
    };

    // Initialize study times from initialSelectedTimes prop
    const initializeStudyTimes = () => {
        const tempStudyTimes = new Array(days.length * times.length).fill(false);
        initialSelectedTimes.forEach(({ day, time }) => {
            const dayIndex = days.indexOf(day);
            const timeIndex = times.indexOf(time);
            if (dayIndex !== -1 && timeIndex !== -1) {
                const index = dayIndex * times.length + timeIndex;
                tempStudyTimes[index] = true;
            }
        });
        setStudyTimes(tempStudyTimes);
    };

    const updateScheduleState = (schedule) => {
        const tempBusyTimes = new Array(days.length * times.length).fill(false);
        const tempStudyTimes = new Array(days.length * times.length).fill(false);

        schedule.forEach(({ day, busyTimes, studyTimes }) => {
            const dayIndex = days.indexOf(day);
            busyTimes.forEach((time) => {
                const timeIndex = times.indexOf(time);
                if (dayIndex !== -1 && timeIndex !== -1) {
                    tempBusyTimes[dayIndex * times.length + timeIndex] = true;
                }
            });
            studyTimes.forEach((time) => {
                const timeIndex = times.indexOf(time);
                if (dayIndex !== -1 && timeIndex !== -1) {
                    tempStudyTimes[dayIndex * times.length + timeIndex] = true;
                }
            });
        });

        setBusyTimes(tempBusyTimes);
        setStudyTimes(tempStudyTimes);
    };

    const getSelectedTime = (rowIndex, columnIndex) => {
        if (type === 'busy') {
            return busyTimes[columnIndex * times.length + rowIndex];
        } else if (type === 'study') {
            return studyTimes[columnIndex * times.length + rowIndex];
        }
    };

    const selectUpdateTime = (rowIndex, columnIndex) => {
        if (type === 'busy') {
            const tempBusyTimes = [...busyTimes];
            tempBusyTimes[columnIndex * times.length + rowIndex] = !tempBusyTimes[columnIndex * times.length + rowIndex];
            setBusyTimes(tempBusyTimes);
        } else if (type === 'study') {
            const tempStudyTimes = [...studyTimes];
            tempStudyTimes[columnIndex * times.length + rowIndex] = !tempStudyTimes[columnIndex * times.length + rowIndex];
            setStudyTimes(tempStudyTimes);
        }
    };

    const dragUpdateTime = (rowIndex, columnIndex) => {
        if (mousePressed) {
            selectUpdateTime(rowIndex, columnIndex);
        }
    };

    const formatUserTimesForDatabase = () => {
        const selectedTimes = type === 'busy' ? busyTimes : studyTimes;
        return days.map((day, dayIndex) => ({
            day,
            [type === 'busy' ? 'busyTimes' : 'studyTimes']: times.filter((_, timeIndex) => selectedTimes[dayIndex * times.length + timeIndex]),
        }));
    };

    const handleSaveSchedule = () => {
        const schedule = formatUserTimesForDatabase();
        saveSchedule(schedule);
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
                    <div className="legend-circle study-courses"></div>
                    Study Courses
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
                                onMouseDown={() => selectUpdateTime(rowIndex, columnIndex)}
                                onMouseOver={() => dragUpdateTime(rowIndex, columnIndex)}
                                className={`time-item cell 
                                    ${getSelectedTime(rowIndex, columnIndex) ? 
                                        (type === 'busy' ? 'busy-time-filled' : 'study-time-filled') 
                                        : ''
                                }`}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
            <button onClick={handleSaveSchedule} className="save-schedule-button">Save Schedule</button>
            <button onClick={loadSchedule} className="refresh-schedule-button">Refresh Schedule</button>
        </div>
    );
};

export default TimeSelector;