import { useEffect, useState } from 'react';
import React from 'react';
import "./TimeSelector.css";



const TimeSelector = () => {
   
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const times = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];
    let [userTimes, setUserTimes] = useState(new Array(days.length*times.length).fill(false));

    const [mousePressed, setMousePressed] = useState(false);

    const getUserTime = (rowIndex, columnIndex) => {
        return userTimes[columnIndex*times.length + rowIndex];
    }

    const selectUpdateUserTime = (rowIndex, columnIndex) => {
        
        const tempUserTimes = [...userTimes];
        tempUserTimes[columnIndex*times.length + rowIndex] = !tempUserTimes[columnIndex*times.length + rowIndex];
        setUserTimes(tempUserTimes);

    }


    const dragUpdateUserTime = (rowIndex, columnIndex) => {
        
        if(mousePressed){
            const tempUserTimes = [...userTimes];
            tempUserTimes[columnIndex*times.length + rowIndex] = !tempUserTimes[columnIndex*times.length + rowIndex];
            setUserTimes(tempUserTimes);
        }

    }

    useEffect(() => {

        // Add event listeners for mouse down and mouse up globally
        document.addEventListener("mousedown", ()=>setMousePressed(true));
        document.addEventListener("mouseup", ()=>setMousePressed(false));
        
        const tempUserTimes = [...userTimes];
        tempUserTimes[4] = true;
        setUserTimes(tempUserTimes);
        
        // Clean up listeners when the component unmounts
        return () => {
            document.removeEventListener("mousedown", ()=>setMousePressed(true));
            document.removeEventListener("mouseup", ()=>setMousePressed(false));
        };

    }, []);

    return(
        
        <div>
            <label>Select Time:</label>
        
            <div className="grid-container">
                <div className="grid-item header">Time / Day</div>
                {days.map((day, index) => (
                    <div key={`${index}`} className="grid-item header">{day}</div>
                ))}
                
                {times.map((time, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                    <div key={`time-${rowIndex}`} className="grid-item time">{time}</div>
                    {days.map((_, columnIndex) => {
                        return (
                            <div 
                            onMouseDown={()=>selectUpdateUserTime(rowIndex,columnIndex)} 
                            onMouseOver={()=>dragUpdateUserTime(rowIndex,columnIndex)} 
                            key={`cell-${rowIndex}-${columnIndex}`} 
                            className={getUserTime(rowIndex,columnIndex) ? "grid-item-filled cell" : "grid-item cell"}>
                            </div>
                        );
                    })}
                    </React.Fragment>
                ))}
            </div>
        </div>
        
    )
};

export default TimeSelector;