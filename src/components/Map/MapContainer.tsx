import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types';

interface MapContainerProps {
  location: Location | null;
  onFlyComplete?: () => void;
}

export const MapContainer = ({ location }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        minZoom: 3,
        maxZoom: 19,
        worldCopyJump: true,
      }).setView([41.0082, 28.9784], 6);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        minZoom: 3,
        maxZoom: 19,
      }).addTo(mapInstance.current);

      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    if (location && mapInstance.current) {
      const { lat, lng, name } = location;

      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstance.current?.removeLayer(layer);
        }
      });

      // Fly to location smoothly with 2-second animation to zoom 14
      mapInstance.current.flyTo([lat, lng], 14, {
        animate: true,
        duration: 2.0,
      });

      const customIcon = L.divIcon({
        className: 'geogemini-custom-marker',
        html: `
          <div style="position: relative; width: 44px; height: 44px;">
            <div style="
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background: rgba(255, 182, 166, 0.45);
              animation: radar-pulse 2s ease-out infinite;
            "></div>
            <div style="
              position: absolute;
              inset: 8px;
              background: #FFB6A6;
              border-radius: 50%;
              box-shadow: 0 6px 18px rgba(255, 182, 166, 0.6);
              border: 3px solid #FFEBD3;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 10px;
                height: 10px;
                background: #FFEBD3;
                border-radius: 50%;
              "></div>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(
          `
          <div style="text-align: center; padding: 2px;">
            <div style="font-weight: 800; font-size: 15px; color: #2D1810; margin-bottom: 2px;">${name}</div>
            <div style="font-size: 11px; font-weight: 700; color: #7A3A2D;">Keşfedilen Lokasyon</div>
          </div>
        `,
          { closeButton: false }
        );

      // Open popup after fly animation completes
      setTimeout(() => {
        marker.openPopup();
      }, 1500);
    }
  }, [location]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};
