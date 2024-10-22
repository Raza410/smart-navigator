import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { setSelectedGeosearch } from "../../../src/hooks/useSelectedGeosearch";
import useDebounce from "../../hooks/useDebounce";
import Sidebar from "./SideBar";

export default function GeoSearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchManuallyUpdated, setIsSearchManuallyUpdated] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null); // State to manage selected building
  const debouncedSearchTerm = useDebounce(searchTerm, 200); // 500ms delay

  useEffect(() => {
    if (debouncedSearchTerm && isSearchManuallyUpdated) {
      handleSearch(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, isSearchManuallyUpdated]);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`http://localhost:3001/search?q=${query}`);
      const results = await response.json();
      console.log("Search Result", results);
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleResultClick = (result) => {
    setSelectedBuilding(result); // Set the selected building to show in the sidebar
    setSelectedGeosearch(result);
    setSearchTerm(result.type);
    setIsSearchManuallyUpdated(false); // Setting this to false to prevent the API call
    setSearchResults([]);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSelectedGeosearch(null); // Clear the selected geosearch result
  };

  const uniqueSearchResults = searchResults.filter(
    (result, index, self) =>
      index ===
      self.findIndex(
        (r) =>
          r.building_name === result.building_name &&
          r.departments === result.departments
      )
  );

  return (
    <>
      <div className="search-container md:ml-5">
        <input
          type="text"
          placeholder="Search Location"
          className="w-full md:max-w-90 pl-10 pr-10 py-[10px] text-sm text-gray-200 bg-[#4786c7] placeholder:text-gray-200 rounded-full outline-none"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearchManuallyUpdated(true); 
          }}
        />
        <FaSearch className="absolute w-4 h-4 text-gray-200 transform -translate-y-1/2 left-3 md:ml-5 top-1/2" />
        {searchTerm && (
          <FaTimes
            className="absolute w-3 h-3 text-gray-200 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
            onClick={handleClearSearch}
          />
        )}
        {uniqueSearchResults.length > 0 && (
          <div className="absolute left-0 z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg top-full">
            {uniqueSearchResults.map((result) => (
              <div
                key={result.gid}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleResultClick(result)}
              >
                {searchTerm.toLowerCase().includes("facu")
                  ? result.building_name
                  : result.departments}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {selectedBuilding && (
          <Sidebar
            selectedBuilding={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
            style={{
              backgroundColor: "blue",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
      </div>
    </>
  );
}
