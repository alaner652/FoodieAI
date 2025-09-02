"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

// 修復 Leaflet 圖標問題
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

// 地圖點擊事件處理組件
function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
    },
  });
  return null;
}

export default function MapComponent({
  latitude,
  longitude,
  onLocationChange,
}: MapComponentProps) {
  const [position, setPosition] = useState<[number, number]>([
    latitude,
    longitude,
  ]);

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  const handleLocationChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationChange(lat, lng);
  };

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 relative">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <MapClickHandler onLocationChange={handleLocationChange} />
      </MapContainer>

      <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs text-gray-600 shadow-sm">
        💡 點擊地圖或拖動標記來選擇位置
      </div>
    </div>
  );
}
