"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { addLocationChangeListener } from "@/hooks/useLocation";

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
  const [currentLat, setCurrentLat] = useState(latitude);
  const [currentLng, setCurrentLng] = useState(longitude);
  const isUpdatingRef = useRef(false);

  // 監聽全域位置變更
  useEffect(() => {
    const unsubscribe = addLocationChangeListener((lat, lng) => {
      // 避免無限循環更新
      if (!isUpdatingRef.current) {
        setCurrentLat(lat);
        setCurrentLng(lng);
      }
    });

    return unsubscribe;
  }, []);

  // 當 props 改變時，更新本地狀態
  useEffect(() => {
    if (latitude !== currentLat || longitude !== currentLng) {
      setCurrentLat(latitude);
      setCurrentLng(longitude);
    }
  }, [latitude, longitude, currentLat, currentLng]);

  const handleLocationChange = (lat: number, lng: number) => {
    // 標記正在更新，避免循環
    isUpdatingRef.current = true;
    setCurrentLat(lat);
    setCurrentLng(lng);
    onLocationChange(lat, lng);

    // 延遲重置標記
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  };

  return (
    <div className={`w-full ${className}`}>
      <MapComponent
        latitude={currentLat}
        longitude={currentLng}
        onLocationChange={handleLocationChange}
        key={`map-${Math.round(currentLat * 1000)}-${Math.round(currentLng * 1000)}`}
      />
    </div>
  );
}
