import React, { useState, useEffect } from "react";
import { useMap, Polyline, Marker } from "react-leaflet";
import { fetchRoute } from '../../APIs/Api'; // Import the fetchRoute function

export default function MapboxDirections(props) {
  const { userLocation, searchLocation } = props;
  const [routes, setRoutes] = useState([]); // Store multiple routes
  const map = useMap();

  useEffect(() => {
    if (userLocation && searchLocation) {
      console.log('---------Searched Location', searchLocation);

      // Ensure searchLocation is always treated as an array
      const coordinates = Array.isArray(searchLocation[0]) ? searchLocation : [searchLocation];
      console.log('-----------Searched Location Coordinates', coordinates);

      // Clear previous routes
      setRoutes([]);

      // Fetch route for each search location
      coordinates.forEach((location) => {
        getRoute(userLocation, location); // Use getRoute to fetch and update state
      });
    }
  }, [userLocation, searchLocation]);

  // Function to get the route and update the state
  const getRoute = async (start, end) => {
    try {
      const routeData = await fetchRoute(start, end); // Call the API function
      if (routeData.routes && routeData.routes.length > 0) {
        // Process the route and update the state
        const newRoute = routeData.routes[0].geometry.coordinates.map((coord) => [
          coord[1], // Latitude
          coord[0], // Longitude
        ]);
        setRoutes((prevRoutes) => [...prevRoutes, newRoute]); // Add new route to the existing state
        console.log("Route data received:", routeData);
      } else {
        console.log("No routes found for the specified locations.");
      }
    } catch (error) {
      console.error("Error getting route:", error);
    }
  };

  const colors = ['#4B3D3A', '#2E8B57']; // Dark brown and dark seagreen colors

  return (
    <>
      {userLocation && <Marker position={userLocation} />}
      {searchLocation && Array.isArray(searchLocation) && searchLocation.map((location, index) => (
        <Marker key={index} position={location} />
      ))}
      {routes.map((route, index) => (
        <Polyline
          key={index}
          positions={route}
          color={colors[index % colors.length]} // Cycle through the colors
          weight={5} // Line thickness
          opacity={0.8} // Line transparency
          dashArray="5,10" // Dashed line pattern
          lineCap="round" // Rounded endpoints
          lineJoin="round" // Rounded corners
          dashOffset="0" // Starting point of the dashed pattern
          smoothFactor={1} // Smoothness of the polyline
        />
      ))}
    </>
  );
}
