import React, { useState, useEffect } from 'react'
import { useMap, Polyline, Marker } from 'react-leaflet'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWxpaGFpZGVyLTIyIiwiYSI6ImNtMTBqZ2I4NzBoYncybG9yMmQ0MjhpcW4ifQ.y9JQepAw0Fpoygv5W6QYWQ'

export default function MapboxDirections(props) {
    const { userLocation, searchLocation } = props;
    const [route, setRoute] = useState(null)
    const map = useMap()

    useEffect(() => {
        if (userLocation && searchLocation) {
            fetchRoute(userLocation, searchLocation)
        }
    }, [userLocation, searchLocation])

    useEffect(() => {
        if (route) {
            const bounds = route.map(([lat, lng]) => [lat, lng])
            map.fitBounds(bounds, { padding: [50, 50] }) // Adjust padding as needed
        }
    }, [route, map])

    const fetchRoute = async (start, end) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[1]},${start[0]};${end[1]},${end[0]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${MAPBOX_ACCESS_TOKEN}`

        try {
            const response = await fetch(url)
            const data = await response.json()
            if (data.routes && data.routes.length > 0) {
                setRoute(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]))
            }
        } catch (error) {
            console.error('Error fetching route:', error)
        }
    }

    return (
        <>
            {userLocation && <Marker position={userLocation} />}
            {searchLocation && <Marker position={searchLocation} />}
            {route && (
                <Polyline
                    positions={route}
                    color="yellow" // Line color
                    weight={5} // Line thickness
                    opacity={0.8} // Line transparency
                    dashArray="5,10" // Dashed line pattern
                    lineCap="round" // Rounded endpoints
                    lineJoin="round" // Rounded corners
                    dashOffset="0" // Starting point of the dashed pattern
                    smoothFactor={1} // Smoothness of the polyline
                />
            )}
        </>
    )
}
