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
      const coordinates =
        selectedLocation.cui_building.geom.coordinates[0][0].map((coord) => [
          coord[1],
          coord[0],
        ]);
      const bounds = calculateBounds(coordinates);
      const center = calculateCenter(bounds);
      setMarkerPosition(center);
      onLocationSelected(center); // Pass the centroid to parent component
      map.flyToBounds(bounds); // Adjust zoom level to fit the bounding box
    }
  }, [selectedLocation, map, onLocationSelected]);

  const calculateBounds = (coords) => {
    let minLat = coords[0][0];
    let maxLat = coords[0][0];
    let minLng = coords[0][1];
    let maxLng = coords[0][1];

    for (let i = 1; i < coords.length; i++) {
      const lat = coords[i][0];
      const lng = coords[i][1];
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }

    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  };

  const calculateCenter = (bounds) => {
    const lat = (bounds[0][0] + bounds[1][0]) / 2;
    const lng = (bounds[0][1] + bounds[1][1]) / 2;
    return [lat, lng];
  };

  return <>{markerPosition && <Marker position={markerPosition} />}</>;
}
