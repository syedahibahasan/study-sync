import React, { useState } from 'react';
import { useAuth } from '../../hooks/useauth';
import './LocationSelector.css';

const LocationSelector = () => {
  const { user, setUser, savePreferredLocations } = useAuth();
  const [selectedLocations, setSelectedLocations] = useState(user.preferredLocations || []);

  const buildings = [
    { name: 'MLK Library', coords: { top: '10%', left: '5%' } },
    { name: 'Engineering Building', coords: { top: '20%', left: '50%' } },
  ];

  const handleLocationClick = (building) => {
    const isSelected = selectedLocations.includes(building.name);
    const newLocations = isSelected
      ? selectedLocations.filter(location => location !== building.name)  // Remove if selected
      : [...selectedLocations, building.name];  // Add if not selected

    setSelectedLocations(newLocations);
    setUser({ ...user, preferredLocations: newLocations });

    // Pass the operation type to `savePreferredLocations`
    savePreferredLocations(newLocations, isSelected ? "removed" : "added");
  };

  return (
    <div className="location-selector-wrapper">
      <div className="legend-container">
        <div className="legend-item">
          <span className="legend-icon legend-gray"></span> Not Selected
        </div>
        <div className="legend-item">
          <span className="legend-icon legend-green"></span> Selected
        </div>
      </div>
      <div className="map-container">
        <img src="/thumbnail/SJSU_Map.png" alt="SJSU Map" className="sjsu-map-image" />
        {buildings.map((building, index) => (
          <div
            key={index}
            className={`location-marker ${selectedLocations.includes(building.name) ? 'selected' : ''}`}
            style={{ top: building.coords.top, left: building.coords.left }}
            onClick={() => handleLocationClick(building)}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationSelector;
