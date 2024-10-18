import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet.locatecontrol";
// import locateIcon from "/locate.png";

function LocateControl({ onLocationFound }) {
  const map = useMap();

  useEffect(() => {
    const lc = L.control.locate({
      position: "topright",
      strings: {
        title: "Show me where I am, yo!",
      },
      locateOptions: {
        enableHighAccuracy: true,
      },
      flyTo: true,
      drawCircle: true,
      showCompass: true,
      // icon: locateIcon,
    });

    lc.addTo(map);

    const handleLocationFound = (e) => {
      if (onLocationFound) {
        onLocationFound([e.latlng.lat, e.latlng.lng]);
      }
    };

    map.on("locationfound", handleLocationFound);

    return () => {
      map.off("locationfound", handleLocationFound);
      map.removeControl(lc);
    };
  }, [map, onLocationFound]);

  return null;
}

export default LocateControl;
