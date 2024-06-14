import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import MarkerIcon from "./MarkerIcon";
import 'leaflet-geosearch/dist/geosearch.css';

export default function Geocoder () {
    const map = useMap();
  
    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider: provider,
        // showMarker: true,
        // style: "bar",
        // marker: MarkerIcon,
      });
  
      map.addControl(searchControl);
      document.getElementById('findbox').appendChild(
        document.querySelector(".geosearch")
      );
      return () => map.removeControl(searchControl);
    }, [map]);
  
    return null;
  };
  