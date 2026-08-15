import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin, Compass } from 'lucide-react';

export default function Map({ geometry, location }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapError, setMapError] = useState(false);

    const coordinates = geometry && geometry.coordinates && geometry.coordinates.length === 2
        ? geometry.coordinates
        : [77.2090, 28.6139]; // Default Delhi coordinates [lng, lat]

    const token = import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAP_TOKEN;
    const isValidToken = token && !token.includes('fake') && !token.includes('demo');

    useEffect(() => {
        if (!mapContainer.current || !isValidToken || mapError) return;

        mapboxgl.accessToken = token;

        try {
            if (map.current) return;
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: coordinates,
                zoom: 12
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<div style="padding: 6px; font-weight: bold; font-family: sans-serif; color: #fe385c;">📍 ${location || 'Location'}</div>`);

            new mapboxgl.Marker({ color: '#fe385c' })
                .setLngLat(coordinates)
                .setPopup(popup)
                .addTo(map.current);

            map.current.on('error', () => {
                setMapError(true);
            });
        } catch (e) {
            console.warn('Mapbox initialization failed, switching to OpenStreetMap fallback');
            setMapError(true);
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [coordinates, location, isValidToken, mapError]);

    const [lng, lat] = coordinates;
    const bbox = `${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}`;

    return (
        <div className="w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-md relative bg-slate-100 min-h-80">
            {isValidToken && !mapError ? (
                <div ref={mapContainer} className="h-80 w-full" />
            ) : (
                /* Fallback OpenStreetMap View when no Mapbox token is set */
                <iframe
                    title="Location Map"
                    width="100%"
                    height="320"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
                    className="w-full h-80 rounded-3xl"
                />
            )}

            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full text-xs font-bold text-slate-800 shadow-md flex items-center gap-2 border border-slate-100">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{location || 'Exact location provided after booking'}</span>
            </div>
        </div>
    );
}

