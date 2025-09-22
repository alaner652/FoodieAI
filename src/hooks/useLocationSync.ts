"use client";

import { addLocationChangeListener } from "@/contexts/LocationContext";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 位置同步 Hook
 * 用於組件需要即時響應位置變更時使用
 * 例如：地圖組件、位置顯示組件等
 */
export function useLocationSync() {
  const [syncedLocation, setSyncedLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    timestamp: number;
  }>({
    latitude: null,
    longitude: null,
    timestamp: Date.now(),
  });

  const listenerRef = useRef<(() => void) | null>(null);

  // 位置變更回調
  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setSyncedLocation({
      latitude: lat,
      longitude: lng,
      timestamp: Date.now(),
    });
  }, []);

  // 設置監聽器
  useEffect(() => {
    // 清理之前的監聽器
    if (listenerRef.current) {
      listenerRef.current();
    }

    // 添加新的監聽器
    listenerRef.current = addLocationChangeListener(handleLocationChange);

    // 組件卸載時清理監聽器
    return () => {
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
      }
    };
  }, [handleLocationChange]);

  return syncedLocation;
}

/**
 * 位置變更通知 Hook
 * 用於需要在位置變更時執行特定操作的組件
 */
export function useLocationChangeNotification(
  onLocationChange: (lat: number, lng: number) => void
) {
  const listenerRef = useRef<(() => void) | null>(null);
  const callbackRef = useRef(onLocationChange);

  // 更新回調引用
  useEffect(() => {
    callbackRef.current = onLocationChange;
  }, [onLocationChange]);

  // 位置變更處理
  const handleLocationChange = useCallback((lat: number, lng: number) => {
    if (callbackRef.current) {
      callbackRef.current(lat, lng);
    }
  }, []);

  // 設置監聽器
  useEffect(() => {
    // 清理之前的監聽器
    if (listenerRef.current) {
      listenerRef.current();
    }

    // 添加新的監聽器
    listenerRef.current = addLocationChangeListener(handleLocationChange);

    // 組件卸載時清理監聽器
    return () => {
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
      }
    };
  }, [handleLocationChange]);
}
