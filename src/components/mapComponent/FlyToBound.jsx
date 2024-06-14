import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import useFlyToBounds, { useFitBounds } from '../../hooks/useFlyToBounds';
import L from 'leaflet';

const FlyToBounds = () => {
    const map = useMap();
    const bounds = useFlyToBounds();
    // useEffect(() => {
    if (bounds) {
        map.flyToBounds([
            [bounds.miny, bounds.minx],
            [bounds.maxy, bounds.maxx]
        ]);
    }
    // }, [bounds, map]);

    return null;
};

export default FlyToBounds;

export const FitBounds = () => {
    const map = useMap();
    const bounds = useFitBounds();
    useEffect(() => {
        if (bounds) {
            map.fitBounds([
                [bounds.miny, bounds.minx],
                [bounds.maxy, bounds.maxx]
            ]);
        }
    }, [bounds, map]);

    return null;
};