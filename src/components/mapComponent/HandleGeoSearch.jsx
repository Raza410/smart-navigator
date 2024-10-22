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

<<<<<<< HEAD
      // Check if allCoordinates is an array with at least one coordinate pair
      if (Array.isArray(allCoordinates) && allCoordinates.length > 0) {
        // Get the first coordinate pair (assumed to be [latitude, longitude])
        const firstCoordinatePair = allCoordinates[0];
=======
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
>>>>>>> bc12a9d1ac2760d290f1b76f4307fe98b686fe89

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
