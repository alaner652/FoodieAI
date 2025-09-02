"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

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
  // 當 props 改變時，通知 MapComponent 更新位置
  useEffect(() => {
    // 這個 effect 會在 latitude 或 longitude 改變時觸發
    // MapComponent 會接收到新的位置並自動更新
  }, [latitude, longitude]);

  return (
    <div className={`w-full ${className}`}>
      <MapComponent
        latitude={latitude}
        longitude={longitude}
        onLocationChange={onLocationChange}
        key={`${latitude}-${longitude}`} // 強制重新渲染當位置改變
      />
    </div>
  );
}
