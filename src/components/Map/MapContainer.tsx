import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types';

interface MapContainerProps {
    location: Location | null;
}

export const MapContainer = ({ location }: MapContainerProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView([41.0082, 28.9784], 12);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
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

            mapInstance.current.flyTo([lat, lng], 14, {
                animate: true,
                duration: 2
            });

            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `
                    <div style="position: relative; width: 32px; height: 32px;">
                        <div style="
                            position: absolute;
                            inset: 4px;
                            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                            border-radius: 50%;
                            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                            border: 3px solid white;
                        "></div>
                        <div style="
                            position: absolute;
                            inset: 0;
                            border-radius: 50%;
                            border: 2px solid rgba(99, 102, 241, 0.3);
                            animation: marker-pulse 2s ease-out infinite;
                        "></div>
                    </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            L.marker([lat, lng], { icon: customIcon })
                .addTo(mapInstance.current)
                .bindPopup(`<div>${name}</div>`)
                .openPopup();
        }
    }, [location]);

    return <div ref={mapRef} className="h-full w-full z-0" />;
};
