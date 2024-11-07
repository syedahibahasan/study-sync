import "./TimeSelector.css";

const TimeSelector = () => {
   
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const times = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
    
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
                        <div key={`cell-${rowIndex}-${dayIndex}`} className="grid-item cell"></div>
                    ))}
                    </>
                ))}
            </div>
        </div>
        
    )
};

export default TimeSelector;