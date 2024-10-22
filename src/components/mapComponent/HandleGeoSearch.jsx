import { Marker, useMap } from "react-leaflet";
import useSelectedGeosearch from "../../hooks/useSelectedGeosearch";
import { useEffect, useState } from "react";

export default function HandleGeoSearch({ onLocationSelected }) {
  const selectedLocation = useSelectedGeosearch();
  const map = useMap();
  const [markerPositions, setMarkerPositions] = useState([]);

  useEffect(() => {
    if (
      selectedLocation &&
      selectedLocation.cui_building &&
      selectedLocation.cui_building.enterances
    ) {
      const entrances = selectedLocation.cui_building.enterances;

      // Parse entrances if it's a string
      let coordinatesArray;
      try {
        // Code Updated
        // Remove any unwanted characters and parse the string to array
        const formattedString = entrances.replace(/[\{\}]/g, '').trim();
        coordinatesArray = formattedString.split('],[').map(item => {
          const coords = item.replace(/\[|\]/g, '').split(',').map(Number);
          console.log(coords)
          return coords; // Convert string coordinates to numbers
        });
      } catch (error) {
        console.error('Error parsing entrances:', error);
        coordinatesArray = [];
      }

      // Update marker positions
      setMarkerPositions(coordinatesArray);
      onLocationSelected(coordinatesArray); // Send all coordinates back to parent


      // Validate the first entrance's coordinates and set the map view
      const firstEntrance = coordinatesArray[0];
      if (Array.isArray(firstEntrance) && firstEntrance.length === 2) {
        const [lat, lng] = firstEntrance; // lat is the first value, lng is the second
        if (lat !== null && lng !== null) {
          map.setView([lat, lng], 18); // Adjust the zoom level as needed
        }
      }

    }
  }, [selectedLocation, map, onLocationSelected]);

  return (
    <>
      {markerPositions.map((position, index) => (
        <Marker key={index} position={[position[0], position[1]]} />
      ))}
    </>
  );
}