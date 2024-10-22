import { useMapEvents } from "react-leaflet";
import { useState } from "react";

export const MapEventsHandler = ({ datasetsOnMap, wmsLayerInfo }) => {
  const map = useMapEvents({
    click: (e) => {
      console.log("latlon", e.latlng);
    },
    zoomend: (e) => {

      const currentZoom = map.getZoom();
    },
  });

  return null;
};
