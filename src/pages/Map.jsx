import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapStyle from "../components/mapComponent/MapStyle";
import HandleGeoSearch from "../components/mapComponent/HandleGeoSearch";
import { LatLngBounds } from "leaflet";
import { setSelectedGeosearch } from "../hooks/useSelectedGeosearch";
import { useFullscreen } from "@mantine/hooks";
import Control from "react-leaflet-custom-control";
import "leaflet-draw/dist/leaflet.draw.css";
import Navbar from "../components/Navbar";
import Sidebar from '../components/mapComponent/SideBar';
import L from "leaflet";
import "leaflet-polylinedecorator";
import LocateControl from "../components/mapComponent/LocateControl";
import MapboxDirections from "../components/mapComponent/MapboxDirections";

// Function to load image paths based on the building name
const loadBuildingImage = (buildingName) => {
  const folderNames = {
    "Academic block 1": "Academic_block_1",
    "Acadamic block 2": "Acadamic block 2",
    "Acadamic Block 3": "Acadamic Block 3",
    "Library": "Library",
    "Medical Center": "Medical_Center",
    "Student Services Center": "Student_service_center",
    "Mosque": "Mosque",
    "R & D LaB": "R & D LaB",
    "N Block": "N Block",
    "Canteen": "canteen",
    "Faculity block 1": "Faculity block 1",
    "faculity block 2": "faculity block 2",
    "Physics Block": "Physics Block",
    "Store": "Store",
    "SSBC": "SSBC",
    "Staff Canteen": "Staff Canteen",
    "Students Canteen": "Students_Canteen",
    "SportsComplex": "sports_complex",
    "Arts Building": "arts_building",
    "Sports Complex": "sports_complex",
  };

  const folderName = folderNames[buildingName];
  const imageNames = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg"]; // Update this with actual image names
  const imagePaths = imageNames.map((imageName) => `/images/${folderName}/${imageName}`);

  return imagePaths[0]; // Return the first image for the popup
};

const buildingStyle = () => ({
  fillColor: "grey", // Fill color
  weight: 2, // Border width
  opacity: 2, // Border opacity
  color: "blue", // Border color
  fillOpacity: 0.7, // Fill opacity
});

function Map({ children, style }) {
  const { ref } = useFullscreen();
  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const mapRef = useRef();
  const [tileUrl, setTileUrl] = useState(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  const [roadsData, setRoadData] = useState(null);
  const [buildingsData, setBuildingData] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const worldBounds = new LatLngBounds([-90, -180], [90, 180]);

  useLayoutEffect(() => {
    setSelectedGeosearch(null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roadsResponse, buildingsResponse] = await Promise.all([
          fetch("http://localhost:3001/getroads"),
          fetch("http://localhost:3001/getbuildings"),
        ]);

        const roadsData = await roadsResponse.json();
        const buildingsData = await buildingsResponse.json();

        setRoadData(roadsData);
        setBuildingData(buildingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onEachBuilding = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      const buildingName = feature.properties.name;
      const imagePath = loadBuildingImage(buildingName);
  
      const popupContent = `
        <div style="text-align: center;">
          <img 
            src="${imagePath}" 
            alt="${buildingName}" 
            class="image-popup rounded-sm pt-2" 
            style="max-width: 228px; max-height: 228px;" 
            onerror="this.onerror=null; this.src='/images/default.jpg';" 
          />
        </div>
        <h3 style="text-align: center; margin-top:5px; padding-top: 10px; border-radius: 4px;">
          ${feature.properties.name}
        </h3>
        <span id="details-link" style="text-align: center; display: block; cursor:pointer; font-weight:bold"> See Details</span>
      `;
  
      layer.bindPopup(popupContent);
  
      // Handle popup open event
      layer.on("popupopen", (event) => {
        const detailsLink = document.getElementById("details-link");
  
        if (detailsLink) {
          // Remove any previous click handlers to avoid issues with multiple popups
          detailsLink.onclick = null;
  
          detailsLink.onclick = (e) => {
            e.stopPropagation(); // Prevent click from propagating to the map layer
  
            // Close the popup before setting the selected building
            layer.closePopup();
  
            // Set the selected building and open the sidebar
            setSelectedBuilding(feature.properties); 
          };
        }
      });
  
      // Reset sidebar when the popup closes
      layer.on("popupclose", () => {
        setSelectedBuilding(null); // Clear the sidebar on popup close
      });
    }
  };
  
  return (
    <>
      <Navbar />
      <div
        style={
          style || {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
          }
        }
      >
        <div ref={ref} style={{ flex: 1, flexGrow: 1 }}>
          <MapContainer
            id="map"
            ref={mapRef}
            center={[33.651183246033476, 73.15613195578028]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            minZoom={3}
            maxZoom={23}
            maxBounds={worldBounds}
            maxBoundsViscosity={1.0}
            attributionControl={false}
          >
            <ZoomControl position="topright" />
            <TileLayer url={tileUrl} maxZoom={24} />
            {buildingsData && (
              <GeoJSON
                data={buildingsData}
                onEachFeature={onEachBuilding}
                style={buildingStyle}
              />
            )}
            {roadsData && <GeoJSON data={roadsData} />}
            <MapStyle onStyleChange={setTileUrl} />
            <Control position="bottomleft">
              <img
                src="north/north2.png"
                alt="North"
                style={{ width: "50px" }}
              />
            </Control>

            <LocateControl onLocationFound={setUserLocation} />
            <HandleGeoSearch onLocationSelected={setSearchLocation} />

            {userLocation && <Marker position={userLocation} />}

            {searchLocation && (
              Array.isArray(searchLocation[0]) ? (
                // If searchLocation is an array of arrays
                searchLocation.map((location, index) => (
                  <Marker key={index} position={location} />
                ))
              ) : (
                // If searchLocation is a single location
                <Marker position={searchLocation} />
              )
            )}
            {userLocation && searchLocation && (
              <MapboxDirections
                userLocation={userLocation}
                searchLocation={searchLocation}
              />
            )}
          </MapContainer>
        </div>
      </div>

      {selectedBuilding && (
        <Sidebar
          selectedBuilding={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
        />
      )}
    </>
  );
}

export default Map;
