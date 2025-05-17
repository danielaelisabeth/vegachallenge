'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Standard-Icon-Fix für Leaflet in React
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// Custom icons for different glass types
const createCustomIcon = (type: string) => {
  const color = type === 'white' ? '#E5E7EB' : 
                type === 'green' ? '#10B981' : 
                '#B45309';
  
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function MapLeaflet({ containerMarkers }: { containerMarkers: { id: string, name: string, address: string, type: string }[] }) {
  const karlsruhe: [number, number] = [49.0069, 8.4037];
  // Dummy-Positionen für Marker (hier zufällig um Karlsruhe verteilt)
  const markerPositions = [
    [49.008, 8.395],
    [49.012, 8.41],
    [49.004, 8.41],
    [49.01, 8.39],
    [49.002, 8.4],
    [49.014, 8.42],
    [49.008, 8.43],
    [49.006, 8.39],
    [49.011, 8.405],
    [49.009, 8.415],
    [49.013, 8.398],
    [49.005, 8.418],
    [49.007, 8.425],
  ];

  return (
    <MapContainer center={karlsruhe} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {containerMarkers.map((container, idx) => (
        <Marker 
          key={container.id} 
          position={markerPositions[idx] as [number, number]}
          icon={createCustomIcon(container.type)}
        >
          <Popup>
            <div className="p-2">
              <b>{container.name}</b><br />
              {container.address}<br />
              ID: {container.id}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 