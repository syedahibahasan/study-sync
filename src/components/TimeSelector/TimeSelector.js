import React, { useEffect, useState } from 'react';
import { useAuth } from "../../hooks/useauth";
import "./TimeSelector.css";

const TimeSelector = () => {
    const { user, saveSchedule } = useAuth();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const times = ["9:00 AM", "9:30 AM","10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];
    const [userTimes, setUserTimes] = useState(new Array(days.length * times.length).fill(false));
    const [mousePressed, setMousePressed] = useState(false);

    useEffect(() => {
        if (user && user.schedule) {
            const tempUserTimes = new Array(days.length * times.length).fill(false);
            user.schedule.forEach(({ day, busyTimes }) => {
                const dayIndex = days.indexOf(day);
                busyTimes.forEach((time) => {
                    const timeIndex = times.indexOf(time);
                    if (dayIndex !== -1 && timeIndex !== -1) {
                        tempUserTimes[dayIndex * times.length + timeIndex] = true;
                    }
                });
            });
            setUserTimes(tempUserTimes);
        }
    }, [user]);

    const getUserTime = (rowIndex, columnIndex) => userTimes[columnIndex * times.length + rowIndex];

    const selectUpdateUserTime = (rowIndex, columnIndex) => {
        const tempUserTimes = [...userTimes];
        tempUserTimes[columnIndex * times.length + rowIndex] = !tempUserTimes[columnIndex * times.length + rowIndex];
        setUserTimes(tempUserTimes);
    };

    const dragUpdateUserTime = (rowIndex, columnIndex) => {
        if (mousePressed) {
            const tempUserTimes = [...userTimes];
            tempUserTimes[columnIndex * times.length + rowIndex] = !tempUserTimes[columnIndex * times.length + rowIndex];
            setUserTimes(tempUserTimes);
        }
    };

    const formatUserTimesForDatabase = () => {
        return days.map((day, dayIndex) => ({
            day,
            busyTimes: times.filter((_, timeIndex) => userTimes[dayIndex * times.length + timeIndex]),
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
                                onMouseDown={() => selectUpdateUserTime(rowIndex, columnIndex)}
                                onMouseOver={() => dragUpdateUserTime(rowIndex, columnIndex)}
                                className={getUserTime(rowIndex, columnIndex) ? "time-item-filled cell" : "time-item cell"}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
            <button onClick={handleSaveSchedule} className="save-schedule-button">Save Schedule</button>
        </div>
    );
};

export default TimeSelector;
