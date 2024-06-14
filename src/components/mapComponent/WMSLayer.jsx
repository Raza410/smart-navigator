import { WMSTileLayer } from "react-leaflet";
import appConfig from "../../../appConfig";

const WMSLayer = ({ layerName, opacity, zIndex }) => {
    const geoserver = appConfig.geoserver;
    return (
        <WMSTileLayer
            url={`${geoserver.baseURL}${geoserver.workspace}/wms?`}
            version="1.1.0"
            layers={geoserver.workspace + ":" + layerName}
            transparent="true"
            format="image/png"
            zIndex={99 + zIndex}
            opacity={opacity}
        />
    );
};

export default WMSLayer;