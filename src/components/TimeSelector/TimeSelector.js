import { useEffect, useState } from 'react';
import "./TimeSelector.css";

const TimeSelector = () => {
   
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const times = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
    const [userTimes, setUserTimes] = useState(new Array(182).fill(false));
    
    useEffect = () => {
        console.log("test")
        setUserTimes[5]=true
    }

    return(
        
        <div>
            <label>Select Time:</label>
        
            <div className="grid-container">
                <div className="grid-item header">Time / Day</div>
                {days.map((day, index) => (
                    <div key={index} className="grid-item header">{day}</div>
                ))}
                
                {times.map((time, rowIndex) => (
                    <>
                    <div key={`time-${rowIndex}`} className="grid-item time">{time}</div>
                    {days.map((_, dayIndex) => (
                        <div>
                            {userTimes[(rowIndex*13)+(dayIndex*2)] === true ? (
                                <div key={`cell-${rowIndex}-${dayIndex}`} className="grid-item-filled cell"></div>
                            ) : (
                                <div key={`cell-${rowIndex}-${dayIndex}`} className="grid-item cell"></div>
                            )}

                            {userTimes[((dayIndex*13)+(rowIndex*2))+1] === true ? (
                                <div key={`cell-${rowIndex}-${dayIndex}2`} className="grid-item-filled cell"></div>
                            ) : (
                                <div key={`cell-${rowIndex}-${dayIndex}2`} className="grid-item cell"></div>
                            )}
                            
                        </div>
                    ))}
                    </>
                ))}
            </div>
        </div>
        
    )
};

export default TimeSelector;