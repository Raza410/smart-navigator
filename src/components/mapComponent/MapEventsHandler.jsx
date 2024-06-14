import { useMapEvents } from 'react-leaflet';
import { getFeatureInfo } from './GetFeatureInfo';
import { useState } from 'react';
import { Popup } from 'react-leaflet';
import { Table } from '@mantine/core';
import { notification } from '../../utils/notification';

export const MapEventsHandler = ({
  datasetsOnMap,
  wmsLayerInfo
}) => {
  const [popupInfo, setPopupInfo] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);

  const map = useMapEvents({
    click: async (e) => {
      for (let dataset of datasetsOnMap) {
        const isDatasetInWMSLayerInfo = wmsLayerInfo.some(layer => layer.tableName === dataset.tableName);

        if (isDatasetInWMSLayerInfo) {
          try {
            const result = await getFeatureInfo(e.latlng, map, dataset.tableName);
            if (result) {
              setPopupInfo(result.properties);
              setPopupPosition(e.latlng);
              break;
            }
          } catch (error) {
            notification('Error', `Error getting feature info:${error}`, 'red');
          }
        }
      }
    },
  });

  const tdStyle = {
    wordBreak: 'break-all',
    fontSize: '12px',
    padding: '4px 8px',
    maxWidth: '150px',
    whiteSpace: 'normal'
  };

  const tableContainerStyle = {
    maxWidth: '300px',
    overflow: 'auto',
    maxHeight: '150px'
  };

  const renderTable = (data) => {
    if (!data) return null;

    const rows = Object.entries(data).map(([key, value]) => (
      <Table.Tr key={key}>
        <Table.Td style={tdStyle}>{key}</Table.Td>
        <Table.Td style={tdStyle}>{value}</Table.Td>
      </Table.Tr>
    ));

    return (
      <Table.ScrollContainer style={tableContainerStyle} className='legend-scroll-container'>
        <Table stickyHeader striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Property</Table.Th>
              <Table.Th>Value</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  };

  return (
    <>
      {popupInfo && popupPosition && (
        <Popup position={popupPosition}>
          {renderTable(popupInfo)}
        </Popup>
      )}
    </>
  );
};
