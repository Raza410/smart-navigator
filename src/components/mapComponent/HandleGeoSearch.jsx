import { Marker, useMap } from "react-leaflet";
import useSelectedGeosearch from "../../hooks/useSelectedGeosearch";
import { useEffect, useState } from "react";

export default function HandleGeoSearch({ onLocationSelected }) {
  const selectedLocation = useSelectedGeosearch();
  const map = useMap();
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (
      selectedLocation &&
      selectedLocation.cui_building &&
      selectedLocation.cui_building.enterances
    ) {
      const allCoordinates = selectedLocation.cui_building.enterances; // Ensure this matches your structure
      console.log("All coordinates:", allCoordinates);
      const parsedCoordinates = JSON.parse(
        allCoordinates.replace(/\n/g, "").replace(/}/g, "},").slice(0, -1) + "]"
      ); 
      console.log(parsedCoordinates, "parsedCoordinates");

      try {
        if (Array.isArray(parsedCoordinates) && parsedCoordinates.length > 0) {
          parsedCoordinates.forEach((coordinatePair) => {
            if (Array.isArray(coordinatePair) && coordinatePair.length >= 2) {
              const position = [coordinatePair[0], coordinatePair[1]]; // [latitude, longitude]
              console.log("Marker position:", position);
              setMarkerPosition(position); // Example function call
              onLocationSelected(position); // Call your location selection handler

              // Fly the map to the position
              map.flyTo(position, map.getZoom());
            } else {
              console.error("Invalid coordinate pair:", coordinatePair);
            }
          });
        } else {
          console.error("Invalid entrances structure:", parsedCoordinates);
        }
      } catch (error) {
        console.error("Error parsing entrances:", error);
      }
    } else {
      console.error("Invalid selectedLocation structure:", selectedLocation);
    }
  }, [selectedLocation, map, onLocationSelected]);

  return <>{markerPosition && <Marker position={markerPosition} />}</>;
}
