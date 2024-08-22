import { Box, Transition } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { MapStyleButton } from './MapStyleButton';

const MapStyle = ({ onStyleChange }) => {
  const initialStyle = {
    title: "World Imagery",
    img: `/mapImages/WorldImageMap.png`,
    method: () => onStyleChange("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}")
    // method: () => onStyleChange("https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}")
  };

  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [opened, setOpened] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpened(false));

  const mapStyles = [
    initialStyle,
    { title: "World Imagery", img: `/mapImages/WorldImageMap.png`, method: () => onStyleChange("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}") },
    { title: "Positron", img: `/mapImages/Positron.png`, method: () => onStyleChange("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png") },
    { title: "Dark Matter", img: `/mapImages/DarkMatter.png`, method: () => onStyleChange("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png") },
    { title: "Open Street Map", img: `/mapImages/OSMImage.png`, method: () => onStyleChange("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png") },
    { title: "Open Topo Map", img: `/mapImages/Topographic.png`, method: () => onStyleChange("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png") },
    { title: "NatGeo World Map", img: `/mapImages/NatGeo.png`, method: () => onStyleChange("https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}") },
    { title: "CartoDB Voyager", img: `/mapImages/CartoDB.png`, method: () => onStyleChange("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png") },
    { title: "ESRI World Street Map", img: `/mapImages/ESRI.png`, method: () => onStyleChange("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}") },
    // { title: "DeLorme World Base Map", img: `/mapImages/DeLorme.png`, method: () => onStyleChange("https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}") },
    { title: "ESRI World Topo Map", img: `/mapImages/ESRITopo.png`, method: () => onStyleChange("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}") },
  ];

  const slideRight = {
    in: { opacity: 1, transform: 'translateX(0)' },
    out: { opacity: 0, transform: 'translateX(100%)' },
    common: { transformOrigin: 'right' },
    transitionProperty: 'transform, opacity',
  };

  return (
    <>
      <Box
        maw={200}
        pos="relative"
      >
        <MapStyleButton onClick={() => setOpened(true)} src={selectedStyle.img} alt={selectedStyle.title} />
        <Transition
          mounted={opened}
          transition={slideRight}
          duration={200}
          timingFunction="ease"
          keepMounted
        >
          {(transitionStyle) => (
            <div
              ref={clickOutsideRef}
              style={{ ...transitionStyle, zIndex: 402 }}
              className={`fixed right-4 bottom-16 md:bottom-16 md:right-8 overflow-hidden shadow-2xl`}
            >
              <div
                className="bg-white rounded-lg shadow-lg mt-2 p-4 relative w-80 md:w-96"
              >
                <button
                  onClick={() => setOpened(false)}
                  className="absolute top-4 right-4 text-xl md:text-2xl font-bold"
                >
                  <FaTimes />
                </button>
                <p className="font-bold text-lg md:text-xl">CHANGE LAYER</p>
                <div className="map-style-scroll-container">
                  {mapStyles.map((style, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedStyle(style);
                        style.method();
                        setOpened(false);
                      }}
                      className={`flex-shrink-0 p-2 hover:bg-gray-100 rounded ${selectedStyle.title === style.title ? 'bg-gray-200' : ''
                        }`}
                    >
                      <img
                        src={style.img}
                        alt={style.title}
                        title={style.title}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          )}
        </Transition>
      </Box>
    </>
  );
};

export default MapStyle;
