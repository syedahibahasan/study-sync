import React from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch }) {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search study groups..."
        onChange={handleInputChange}
        aria-label="Search study groups"
      />
    </div>
  );
}
