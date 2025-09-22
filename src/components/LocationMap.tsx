"use client";

import dynamic from "next/dynamic";

// 動態導入地圖組件，禁用 SSR
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
      <div className="text-gray-500">載入地圖中...</div>
    </div>
  ),
});

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

export default function LocationMap({
  latitude,
  longitude,
  onLocationChange,
  className = "",
}: LocationMapProps) {
  // 使用穩定的 key 來強制重新渲染地圖
  const mapKey = `${Math.round((latitude || 0) * 10000)}-${Math.round((longitude || 0) * 10000)}`;

  return (
    <div className={`w-full ${className}`}>
      <MapComponent
        latitude={latitude}
        longitude={longitude}
        onLocationChange={onLocationChange}
        key={mapKey}
      />
    </div>
  );
}
