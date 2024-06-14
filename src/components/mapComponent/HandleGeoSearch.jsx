import { Marker, useMap } from "react-leaflet";
import useSelectedGeosearch from "../../hooks/useSelectedGeosearch";
import { useEffect } from "react";

export default function HandleGeoSearch() {
    const selectedLocation = useSelectedGeosearch();
    const mapInstance = useMap();
    useEffect(() => {
        if (selectedLocation && selectedLocation.x !== undefined && selectedLocation.y !== undefined) {
            const newLatLng = [selectedLocation.y, selectedLocation.x]; // Adjust according to your data structure
            mapInstance.flyTo(newLatLng, 14); // Adjust zoom level as needed
        }
    }, [selectedLocation, mapInstance]);

    return (selectedLocation && selectedLocation.x !== undefined && selectedLocation.y !== undefined)
        ? <Marker position={[selectedLocation.y, selectedLocation.x]} />
        : null;
}