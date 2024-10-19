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
      selectedLocation.cui_building.geom
    ) {
      
      const allCoordinates = selectedLocation.cui_building.geom.coordinates;

      
      console.log('All coordinates:', allCoordinates);

      
      const coordinates = allCoordinates.flatMap(polygon => 
        polygon[0].map((coord) => [coord[1], coord[0]])
      );

      console.log(`Number of coordinate sets: ${coordinates.length}`);
      coordinates.forEach((coord, index) => {
        console.log(`Set ${index + 1}:`, coord);
      });

  
      const firstCoordinate = coordinates[0];
      setMarkerPosition(firstCoordinate);
      onLocationSelected(firstCoordinate); 

      
      map.flyTo(firstCoordinate, map.getZoom()); 
    }
  }, [selectedLocation, map, onLocationSelected]);

  return <>{markerPosition && <Marker position={markerPosition} />}</>;
}
