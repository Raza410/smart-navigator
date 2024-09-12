import L from "leaflet";
import "leaflet.locatecontrol";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import locateIcon from "../../../public/locate.png";

function LocateControl() {
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
      icon: locateIcon,
    });

    map.addControl(lc);
    return () => map.removeControl(lc);
  }, [map]);

  return null;
}

export default LocateControl;
