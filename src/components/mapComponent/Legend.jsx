import React, { useEffect, useState } from 'react';
// import appConfig from '../../../appConfig';
import { Table, Text } from '@mantine/core';
import { FaMap, FaTimes } from 'react-icons/fa';

const Legend = ({ datasetsOnMap }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [initialized, setInitialized] = useState(false);
    // const geoserver = appConfig.geoserver;

    useEffect(() => {
        if (datasetsOnMap.length === 1 && !initialized) {
            setShowDetails(true);
            setInitialized(true);
        }
    }, [datasetsOnMap, initialized]);

    const getLegendUrl = (layerName) => {
        return `${geoserver.baseURL}${geoserver.workspace}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layerName}`;
    };

    const toggleDetails = () => setShowDetails(!showDetails);

    return (
        <>
            {!showDetails && (
                <div className='rounded-full' style={{ background: 'linear-gradient(to bottom, #0B9CEC, #274A9B)', padding: '10px' }}
                >
                    <button title='legend' onClick={toggleDetails} className='flex items-center'>
                        <FaMap size={16} color='white' />
                    </button>
                </div>
            )}
            {showDetails && (
                <div className='shadow-2xl rounded-md overflow-auto max-h-40 legend-scroll-container' style={{ backgroundColor: 'white', padding: '12px' }}>
                    <button onClick={toggleDetails} className="absolute top-3 right-4 font-bold text-base">
                        <FaTimes size={12} />
                    </button>
                    <Text size='md' fw={700}>Legend</Text>
                    {datasetsOnMap.length > 0 ? (
                        <Table striped highlightOnHover withColumnBorders>
                            <Table.Tbody>
                                {datasetsOnMap.map((dataset, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td>
                                            <img src={getLegendUrl(dataset.tableName)} alt={`Legend for ${dataset.fileName}`} />
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size='xs'>{dataset.fileName}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <Text size='sm' fw={500}>No layer found</Text>
                    )}
                </div>
            )}
        </  >
    );
};

export default Legend;
