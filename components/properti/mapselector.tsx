"use client";

import { useEffect, useRef, useState } from "react";

interface MapSelectorProps {
  value?: { lat: number; lng: number } | null;
  onChange?: (coords: { lat: number; lng: number } | null, address?: string) => void;
  height?: string;
}

export default function MapSelector({ 
  value, 
  onChange, 
  height = "300px" 
}: MapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(value || null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCoords(value || null);
  }, [value]);

  useEffect(() => {
    if (isLoaded && mapInstanceRef.current && coords && !markerRef.current) {
      const L = require("leaflet");
      markerRef.current = L.marker([coords.lat, coords.lng]).addTo(mapInstanceRef.current);
      // center map on the selected coords
      try {
        mapInstanceRef.current.setView([coords.lat, coords.lng], mapInstanceRef.current.getZoom());
      } catch (err) {
        // ignore if setView fails for any reason
      }
    } else if (isLoaded && mapInstanceRef.current && coords && markerRef.current) {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      try {
        mapInstanceRef.current.setView([coords.lat, coords.lng], mapInstanceRef.current.getZoom());
      } catch (err) {
        // ignore
      }
    }
  }, [isLoaded, coords]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadMap = async () => {
      try {
        const L = require("leaflet");
        
        if (!mapInstanceRef.current && mapRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView(
            [coords?.lat || -6.2, coords?.lng || 106.816666],
            13
          );

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(mapInstanceRef.current);

          // Disable default double-click zoom
          mapInstanceRef.current.doubleClickZoom.disable();

          // Function to reverse geocode coordinates to address
          const reverseGeocode = async (lat: number, lng: number) => {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              const data = await response.json();
              return data.address?.road || data.address?.street || data.address?.suburb || data.address?.city || data.address?.town || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            } catch (error) {
              console.error("Reverse geocoding error:", error);
              return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }
          };

          // Add double-click handler to place marker
          mapInstanceRef.current.on("dblclick", async (e: any) => {
            const { lat, lng } = e.latlng;
            const newCoords = { lat, lng };
            const address = await reverseGeocode(lat, lng);
            
            setCoords(newCoords);
            onChange?.(newCoords, address);

            // Place or update marker
            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lng]);
            } else {
              markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
            }
          });

          // Add initial marker if coords exist
          if (coords) {
            markerRef.current = L.marker([coords.lat, coords.lng]).addTo(mapInstanceRef.current);
          }
        }

        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading map:", err);
      }
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-300">
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full bg-gray-100"
      />
    </div>
  );
}
