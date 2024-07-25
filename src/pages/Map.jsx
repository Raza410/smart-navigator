import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import Sidebar from '../components/mapComponent/SideBar';


function Map({ children, style, datasets, mapprops }) {
    const { ref, toggle, fullscreen } = useFullscreen();
    const mapRef = useRef();
    const [tileUrl, setTileUrl] = useState("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
    const [measureToolLoaded, setMeasureToolLoaded] = useState(false);
    const [roadsData, setRoadData] = useState(null); // State to store the fetched road data
    const [buildingsData, setBuildingData] = useState(null); // State to store the fetched road data
    const [selectedBuilding, setSelectedBuilding] = useState(null); // State to manage selected building

    const worldBounds = new LatLngBounds(
        [-90, -180], // Southwest coordinates
        [90, 180]  // Northeast coordinates
    );

    // Reset selected geosearch on component mount
    useLayoutEffect(() => {
        setSelectedGeosearch(null);
    }, []);

    // Fetch road data on component mount
    useEffect(() => {
        const fetchRoadData = async () => {
            try {
                const response = await fetch('http://localhost:3001/getroads');
                const data = await response.json();
                setRoadData(data);
            } catch (error) {
                console.error('Error fetching road data:', error);
            }
        };
        fetchRoadData();
    }, []);

    // Fetch building data on component mount
    useEffect(() => {
        const fetchBuildingData = async () => {
            try {
                const response = await fetch('http://localhost:3001/getbuildings');
                const data = await response.json();
                console.log("Building", data)
                setBuildingData(data);
            } catch (error) {
                console.error('Error fetching Building data:', error);
            }
        };
        fetchBuildingData();
    }, []);

    // Handle popup and click events for buildings
    const onEachBuilding = (feature, layer) => {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(`<h3 style="text-align: center;">${feature.properties.name}</h3>
                         <span id="details-link" style="text-align: center; display: block; cursor:pointer; font-weight:bold">Details</span>`);
        }

        layer.on({
            click: (event) => {
                layer.bindPopup(`<h2>${event.sourceTarget.feature.properties.Name}</h2><br>
                    <img src=${event.sourceTarget.feature.properties.Departments[0].Image}  />`)
            }
        });
        layer.on('popupopen', (event) => {
            const detailsLink = document.getElementById('details-link');
            if (detailsLink) {
                detailsLink.addEventListener('click', () => {
                    setSelectedBuilding(event.popup._source.feature.properties);
                });
            }
        });
    };

    // Placeholder functions for draw tool events
    const handleCreate = (e) => { console.log(e) };
    const handleEdit = (e) => { console.log(e) };
    const handleDelete = (e) => { console.log(e) };

    return (
        <>
            <Navbar />
            <div style={style ? style : { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
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
                        {buildingsData && <GeoJSON data={buildingsData} onEachFeature={onEachBuilding} />}
                        {roadsData && <GeoJSON data={roadsData} />}
                        <MapStyle onStyleChange={setTileUrl} />
                        <Control position="bottomleft">
                            <img src="north/north2.png" alt="North" style={{ width: '50px' }} />
                        </Control>
                    </MapContainer>
                </div>
            </div>

            {selectedBuilding && <Sidebar selectedBuilding={selectedBuilding} onClose={() => setSelectedBuilding(null)} />}
        </>
    );
}

export default Map;
