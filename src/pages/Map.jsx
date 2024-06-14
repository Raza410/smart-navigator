import React, { Suspense, useLayoutEffect, useRef, useState } from 'react';
import { FeatureGroup, MapContainer, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapStyle from '../components/mapComponent/MapStyle';
import HandleGeoSearch from '../components/mapComponent/HandleGeoSearch';
import { LatLngBounds } from 'leaflet';
import { setSelectedGeosearch } from '../hooks/useSelectedGeosearch';
import { useFullscreen } from '@mantine/hooks';
import Control from 'react-leaflet-custom-control';
import 'leaflet-draw/dist/leaflet.draw.css';
import DrawTool from '../components/mapComponent/DrawTool';
import Navbar from '../components/Navbar';
import {cuiBuildings} from "../assets/geometries/cui_buildngs.js"
import {cuiRoads} from "../assets/geometries/cui_roads.js"
import {departments} from "../assets/geometries/departments.js"

function Map({ children, style, datasets, mapprops }) {
  const { ref, toggle, fullscreen } = useFullscreen();
  const mapRef = useRef();
  const [tileUrl, setTileUrl] = useState("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
  const [measureToolLoaded, setMeasureToolLoaded] = useState(false);
  const worldBounds = new LatLngBounds(
    [-90, -180], // Southwest coordinates
    [90, 180]  // Northeast coordinates
  );

  useLayoutEffect(() => {
    setSelectedGeosearch(null);
  }, [])

  const onEachBuilding = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`<h2>${feature.properties.name}</h2>`);
    }
    layer.on({
      click: (event) => {
        console.log("fuck", event.sourceTarget.feature.properties.Departments)
    layer.bindPopup(`<h2>${event.sourceTarget.feature.properties.Name}</h2><br>
                    <img src=${event.sourceTarget.feature.properties.Departments[0].Image} />
    
    `);

        // You can also do something here if you need to handle the click event specifically
      }
    });
  };

  const handleCreate = (e) => { console.log(e) };
  const handleEdit = (e) => { console.log(e) };
  const handleDelete = (e) => { console.log(e) };

  return (
    <>
    <Navbar />
    <div style={style ? style : { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', 'flexDirection': 'column' }}>
      <div ref={ref} style={{ flex: 1, flexGrow: 1 }}>
        <MapContainer
          id="map"
          ref={mapRef}
          center={[33.651183246033476, 73.15613195578028]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          minZoom={3}
          maxZoom={18}
          maxBounds={worldBounds}
          maxBoundsViscosity={1.0}
          attributionControl={false}
          {...mapprops}
          trackResize={true}
        >
          {/* <FlyToBounds /> */}
          <HandleGeoSearch />
          <ZoomControl position="topright" />
          <Control position="topright">
            <DrawTool
              onCreated={handleCreate}
              onEdited={handleEdit}
              onDeleted={handleDelete}
            />
          </Control>
          <TileLayer url={tileUrl} />
          <GeoJSON data={cuiBuildings} onEachFeature={onEachBuilding}/>
          <GeoJSON data={cuiRoads} />
          <MapStyle onStyleChange={setTileUrl} />
          <Control position="bottomleft">
            <img src="north/north2.png" alt="North" style={{ width: '50px' }} />
          </Control>
        </MapContainer>
      </div>
      {/* <AttributeTableProvider /> */}


    </div >
    </>
  );
}

export default Map;
