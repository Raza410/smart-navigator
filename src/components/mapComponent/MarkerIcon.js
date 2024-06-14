import L from "leaflet";
// import markerIcon from "../../../../public/img/LocationIcon.png";

var MarkerIcon = new L.Icon({
  // iconUrl: require("../../../../public/LocationIcon.png"),
  // shadowUrl: require("../../../../public/img/marker_shadow.png").default,
  iconSize: [50, 82], 
  iconAnchor: [25, 82],  
  popupAnchor: [0, -90], 
  shadowSize: [40,0],
});

export default MarkerIcon;
