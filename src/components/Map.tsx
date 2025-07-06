'use client'

import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
  title?: string;
  height?: string;
}

function MapComponent({ latitude, longitude, title = 'Localisation', height = '300px' }: MapProps) {
  // Fix pour les icônes Leaflet (nécessaire avec react-leaflet)
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={true}
      style={{ width: '100%', height, borderRadius: '8px', overflow: 'hidden' }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '300px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    }}>
      Chargement de la carte...
    </div>
  ),
}); 