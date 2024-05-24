import React from "react";

const Filter = ({ sortBy, setSortBy }) => {
  return (
    <div className="filter">
      <label htmlFor="sort">Sort by: </label>
      <select className="dropdown"
        id="sort"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="height">Height</option>
        <option value="mass">Mass</option>
        <option value="hair_color">Hair Color</option>
        <option value="skin_color">Skin Color</option>
        <option value="eye_color">Eye Color</option>
        <option value="birth_year">Birth Year</option>
        <option value="gender">Gender</option>
      </select>
    </div>
  );
};

export default Filter;
