import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Adjust the import path as necessary

// List of buildings (departments)
const buildingsList = [
  { name: "canteen", building_name: "Canteen" },
  { name: "library", building_name: "Library" },
  { name: "gym", building_name: "Gym" },
  // Add more buildings as needed
];

export default function BuildingSelector() {
  const [selectedBuilding, setSelectedBuilding] = useState(null); // To track the selected building
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // To handle sidebar visibility

  const handleBuildingClick = (building) => {
    console.log("Building clicked:", building); // Console log to check which building is clicked
    setSelectedBuilding(building);
    setIsSidebarOpen(true); // Open the sidebar when a building is clicked
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false); // Close the sidebar
  };

  return (
    <div className="building-selector">
      <h1 className="text-xl font-bold">Select a Building</h1>
      <ul className="building-list">
        {buildingsList.map((building, index) => (
          <li key={index} className="building-item">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => handleBuildingClick(building)}
            >
              {building.building_name}
            </button>
          </li>
        ))}
      </ul>

      {isSidebarOpen && selectedBuilding && (
        <Sidebar
          selectedBuilding={selectedBuilding}
          onClose={closeSidebar}
        />
      )}
    </div>
  );
}
