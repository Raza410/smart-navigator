import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { setSelectedGeosearch } from "../../../src/hooks/useSelectedGeosearch";
import { handleSearch } from '../../APIs/Api'; 
import useDebounce from "../../hooks/useDebounce";
import Sidebar from "./SideBar";

export default function GeoSearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchManuallyUpdated, setIsSearchManuallyUpdated] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null); // State to manage selected building
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  useEffect(() => {
    if (debouncedSearchTerm && isSearchManuallyUpdated) {
      onSearch(debouncedSearchTerm); // Call the onSearch function
    } else {
      setSearchResults([]); // Clear results if the search term is empty
    }
  }, [debouncedSearchTerm, isSearchManuallyUpdated]);

  // Updated the onSearch function to handle API calls
  const onSearch = async (query) => {
    try {
      const results = await handleSearch(query); // Call the updated handleSearch
      setSearchResults(results); // Update state with search results
    } catch (error) {
      console.error("Error in search operation:", error);
    }
  };

  const handleResultClick = (result) => {
    setSelectedBuilding(result); // Set the selected building to show in the sidebar
    setSelectedGeosearch(result);
    setSearchTerm(result.type); // Assuming you want to display the result type
    setIsSearchManuallyUpdated(false); // Prevent further API calls
    setSearchResults([]); // Clear search results
  };

  const handleClearSearch = () => {
    setSearchTerm(""); // Clear the search input
    setSearchResults([]); // Clear the search results
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
      <div className="relative search-container md:pl-4"> {/* Added 'relative' for positioning */}
        <input
          type="text"
          placeholder="Search Location"
          className="w-full max-w-[100%] md:max-w-[100%] pl-10 pr-10 py-[10px] text-sm text-gray-200 bg-[#4786c7] placeholder:text-gray-200 rounded-full outline-none"
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
          <div className="absolute left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-2xl top-full">
            {uniqueSearchResults.map((result) => (
              <div
                key={result.gid}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleResultClick(result)} // Call handleResultClick
              >
                {searchTerm.toLowerCase().includes("facu")
                  ? result.building_name
                  : result.departments}
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedBuilding && (
        <Sidebar
          selectedBuilding={selectedBuilding}
          onClose={() => setSelectedBuilding(null)} // Close sidebar
          style={{
            backgroundColor: "blue",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      )}
    </>
  );
}
