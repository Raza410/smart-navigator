import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  Marker,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import MapStyle from "../components/mapComponent/MapStyle"
import HandleGeoSearch from "../components/mapComponent/HandleGeoSearch"
import { LatLngBounds } from "leaflet"
import { setSelectedGeosearch } from "../hooks/useSelectedGeosearch"
import { useFullscreen } from "@mantine/hooks"
import Control from "react-leaflet-custom-control"
import "leaflet-draw/dist/leaflet.draw.css"
import DrawTool from "../components/mapComponent/DrawTool"
import Navbar from "../components/Navbar"
import Sidebar from '../components/mapComponent/SideBar'
import L from "leaflet"
import "leaflet-polylinedecorator"
import LocateControl from "../components/mapComponent/LocateControl"
import MapboxDirections from "../components/mapComponent/MapboxDirections"

const buildingStyle = () => {
  return {
    fillColor: "grey", // Fill color
    weight: 2, // Border width
    opacity: 2, // Border opacity
    color: "blue", // Border color
    fillOpacity: 0.7, // Fill opacity
  };
};

function Map({ children, style, datasets }) {
  const { ref, toggle, fullscreen } = useFullscreen();
  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const mapRef = useRef();
  const [tileUrl, setTileUrl] = useState(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  const [measureToolLoaded, setMeasureToolLoaded] = useState(false);
  const [roadsData, setRoadData] = useState(null);
  const [buildingsData, setBuildingData] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const worldBounds = new LatLngBounds([-90, -180], [90, 180]);

  useLayoutEffect(() => {
    setSelectedGeosearch(null);
  }, []);

  useEffect(() => {
    const fetchRoadData = async () => {
      try {
        const response = await fetch("http://localhost:3001/getroads");
        const data = await response.json();
        setRoadData(data);
        console.log("roads", data);
      } catch (error) {
        console.error("Error fetching road data:", error);
      }
    };
    fetchRoadData();
  }, []);

  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        const response = await fetch("http://localhost:3001/getbuildings");
        const data = await response.json();
        console.log("Building", data);
        setBuildingData(data);
      } catch (error) {
        console.error("Error fetching Building data:", error);
      }
    };
    fetchBuildingData();
  }, []);

  const onEachBuilding = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <h3 style="text-align: center; background-color: #0B9CEC; margin-top:5px ; margin-bottom:5px;padding: 10px; border-radius: 4px;">
          ${feature.properties.name}
        </h3>
        <span id="details-link" style="text-align: center; display: block; cursor:pointer; font-weight:bold">Details</span>
      `);
                         
    }
    layer.on({
      click: (event) => {
        layer.bindPopup(`<h2>${event.sourceTarget.feature.properties.Name}</h2><br>
                    <img src=${event.sourceTarget.feature.properties.Departments[0].Image}  />`);
      },
    });
    layer.on("popupopen", (event) => {
      const detailsLink = document.getElementById("details-link");
      if (detailsLink) {
        detailsLink.addEventListener("click", () => {
          setSelectedBuilding(event.popup._source.feature.properties);
        });
      }
    });
  };

  return (
    <>
      <Navbar />
      <div
        style={
          style
            ? style
            : {
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
            // trackResize={true}
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
            {/* <MapEventsHandler /> */}

            <LocateControl onLocationFound={setUserLocation} />
            <HandleGeoSearch onLocationSelected={setSearchLocation} />
            {userLocation && <Marker position={userLocation} />}
            {searchLocation && <Marker position={searchLocation} />}

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
