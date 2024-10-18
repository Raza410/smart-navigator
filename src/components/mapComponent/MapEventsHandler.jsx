import { useMapEvents } from "react-leaflet";
import { useState } from "react";

export const MapEventsHandler = ({ datasetsOnMap, wmsLayerInfo }) => {
  const map = useMapEvents({
    click: (e) => {
      console.log("latlon", e.latlng);
    },
    zoomend: (e) => {
      console.log("first", e);

      const currentZoom = map.getZoom();
      console.log("Current Zoom Level:", currentZoom);
    },
  });

  return null;
};
