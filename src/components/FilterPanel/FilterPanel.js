import React from "react";
import "./FilterPanel.css";

export default function FilterPanel({ isOpen }) {
  return (
    <div
      id="filter-panel"
      className={`filter-panel ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
    >
      <h4>Filter by:</h4>
      <div className="filter-list">
        {["Class 📚", "Time ⏰", "Location 📌"].map((item) => (
          <label key={item}>
            {item}
            <input type="checkbox" name={item} />
          </label>
        ))}
      </div>
    </div>
  );
}
