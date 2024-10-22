import React, { useState, useEffect } from "react";
import { useMap, Polyline, Marker } from "react-leaflet";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYWxpaGFpZGVyLTIyIiwiYSI6ImNtMTBqZ2I4NzBoYncybG9yMmQ0MjhpcW4ifQ.y9JQepAw0Fpoygv5W6QYWQ";

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
        fetchRoute(userLocation, location);
      });
    }
  }, [userLocation, searchLocation]);

  const fetchRoute = async (start, end) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[1]},${start[0]};${end[1]},${end[0]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("data is", data); // Log the response data directly
      if (data.routes && data.routes.length > 0) {
        // Add the fetched route as a new entry in the routes array
        setRoutes((prevRoutes) => [
          ...prevRoutes,
          data.routes[0].geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ]),
        ]);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <>
      {userLocation && <Marker position={userLocation} />}
      {searchLocation && Array.isArray(searchLocation[0]) && searchLocation.map((location, index) => (
        <Marker key={index} position={location} />
      ))}
      {routes.map((route, index) => (
        <Polyline
          key={index}
          positions={route}
          color={`hsl(${index * 60}, 100%, 50%)`} // Different colors for each route
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
