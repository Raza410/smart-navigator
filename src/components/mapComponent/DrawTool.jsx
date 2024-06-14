import React, { useState } from 'react';
import { FaDrawPolygon } from 'react-icons/fa';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

const DrawTool = ({ onCreated }) => {
    const [showPolygonTool, setShowPolygonTool] = useState(false);

    const handleIconClick = () => {
        setShowPolygonTool(!showPolygonTool);
    };

    const drawConfig = {
        marker: false,
        polyline: false,
        circle: false,
        circlemarker: false,
        rectangle: false,
        polygon: showPolygonTool,
    };

    const editConfig = {
        edit: showPolygonTool ? { featureGroup: <FeatureGroup /> } : false,
        remove: showPolygonTool ? { featureGroup: <FeatureGroup /> } : false,
    };

    return (
        <>
            <div
                title='Draw Tool'
                className='rounded-full text-white cursor-pointer'
                style={{ background: 'linear-gradient(to bottom, #0B9CEC, #274A9B)', padding: '10px' }}
                onClick={handleIconClick}
            >
                <FaDrawPolygon size={16} />
            </div>
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={onCreated}
                    draw={drawConfig}
                    edit={editConfig}
                />
            </FeatureGroup>
        </>
    );
};

export default DrawTool;
