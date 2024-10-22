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
      selectedLocation.cui_building.enterances // Ensure this matches your structure
    ) {
      const allCoordinates = selectedLocation.cui_building.enterances; // This should be your coordinate structure
      console.log("All coordinates:", allCoordinates);

      // Check if allCoordinates is an array with at least one coordinate pair
      if (Array.isArray(allCoordinates) && allCoordinates.length > 0) {
        // Get the first coordinate pair (assumed to be [latitude, longitude])
        const firstCoordinatePair = allCoordinates[0];

        // Check if the first coordinate pair is valid
        if (Array.isArray(firstCoordinatePair) && firstCoordinatePair.length >= 2) {
          const position = [firstCoordinatePair[0], firstCoordinatePair[1]]; // [latitude, longitude]
          console.log("Marker position:", position); // Log the position

          setMarkerPosition(position);
          onLocationSelected(position); 

          // Fly the map to the position
          map.flyTo(position, map.getZoom());
        } else {
          console.error("Invalid first coordinate pair:", firstCoordinatePair);
        }
      } else {
        console.error("Invalid entrances structure:", allCoordinates);
      }
    } else {
      console.error("Invalid selectedLocation structure:", selectedLocation);
    }
  }, [selectedLocation, map, onLocationSelected]);

  return <>{markerPosition && <Marker position={markerPosition} />}</>;
}
