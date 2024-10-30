import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Search/search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to the search results page or handle the search logic here
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="searchform">
      <div className="searchcontainer">
        <input
          className="inputbar"
          type="text"
          placeholder="Search for Study Group..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="searchbutton" type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {/*change button to be in search bar and look like searching icon*/}
      </div>
    </form>
  );
}

export default SearchBar;
