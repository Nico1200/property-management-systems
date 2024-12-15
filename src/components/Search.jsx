/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        className="border border-gray-300 rounded-md w-full p-2"
        placeholder="Search properties..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default Search;
