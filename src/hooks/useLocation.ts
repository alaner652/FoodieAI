import { useToastContext } from "@/contexts/ToastContext";
import { useCallback, useEffect, useState } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  locationSource: "gps" | "network" | "manual" | null;
  isGettingLocation: boolean;
  error: string;
  radius: number;
  lastManualLocation: { lat: number; lng: number; timestamp: number } | null;
  pendingLocationUpdate: {
    lat: number;
    lng: number;
    source: "gps" | "network";
    distance: number;
  } | null;
}

export const useLocation = () => {
  const { showError } = useToastContext();
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    locationSource: null,
    isGettingLocation: false,
    error: "",
    radius: 1.5,
    lastManualLocation: null,
    pendingLocationUpdate: null,
  });

  // 計算兩個位置之間的距離（公里）
  const calculateDistance = useCallback(
    (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 6371; // 地球半徑（公里）
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  // Initialize location from localStorage on mount
  useEffect(() => {
    try {
      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        const {
          latitude,
          longitude,
          locationSource,
          timestamp,
          radius,
          lastManualLocation,
        } = locationData;

        // 檢查位置資料是否仍然有效（不超過 24 小時）
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;

        if (!isExpired && latitude && longitude) {
          setState((prev) => ({
            ...prev,
            latitude,
            longitude,
            locationSource,
            radius: radius || 1.5,
            lastManualLocation: lastManualLocation || null,
            error: "",
          }));
          console.log("Location restored from localStorage:", locationData);
        } else if (isExpired) {
          // 移除過期的位置資料
          localStorage.removeItem("userLocation");
          console.log("Expired location data removed from localStorage");
        }
      }
    } catch (error) {
      console.error("Failed to restore location from localStorage:", error);
      // 移除損壞的資料
      localStorage.removeItem("userLocation");
    }
  }, []);

  const setRadius = useCallback(
    (newRadius: number) => {
      // 驗證半徑範圍 (0.2 公里到 5 公里)
      if (newRadius < 0.2 || newRadius > 5) {
        showError("半徑必須在 0.2 到 5 公里之間", "半徑設定錯誤");
        return false;
      }

      setState((prev) => ({ ...prev, radius: newRadius }));

      // 如果已經有位置設定，更新 localStorage
      if (state.latitude && state.longitude) {
        try {
          const savedLocation = localStorage.getItem("userLocation");
          if (savedLocation) {
            const locationData = JSON.parse(savedLocation);
            locationData.radius = newRadius;
            localStorage.setItem("userLocation", JSON.stringify(locationData));
          }
        } catch (error) {
          console.error("Failed to update radius in localStorage:", error);
        }
      }

      console.log("Radius updated to:", newRadius, "km");
      return true;
    },
    [state.latitude, state.longitude, showError]
  );

  const setManualLocation = useCallback(
    (lat: number, lng: number) => {
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        const errorMsg = "Coordinates out of valid range";
        setState((prev) => ({
          ...prev,
          error: errorMsg,
        }));
        showError(errorMsg, "無效座標");
        return false;
      }

      const now = Date.now();

      // 記錄手動設定的位置和時間
      const manualLocation = { lat, lng, timestamp: now };

      // 儲存到 localStorage 以保持持久性
      const locationData = {
        latitude: lat,
        longitude: lng,
        locationSource: "manual" as const,
        radius: state.radius,
        timestamp: now,
        lastManualLocation: manualLocation,
      };
      localStorage.setItem("userLocation", JSON.stringify(locationData));

      setState((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        locationSource: "manual",
        lastManualLocation: manualLocation,
        pendingLocationUpdate: null, // 清除待確認的更新
        error: "",
      }));

      console.log("Manual location set successfully:", { lat, lng });
      return true;
    },
    [state.radius, showError]
  );

  // 新增：確認位置更新
  const confirmLocationUpdate = useCallback(
    (lat: number, lng: number, source: "gps" | "network") => {
      const locationData = {
        latitude: lat,
        longitude: lng,
        locationSource: source,
        radius: state.radius,
        timestamp: Date.now(),
        lastManualLocation: state.lastManualLocation, // 保持手動設定記錄
      };
      localStorage.setItem("userLocation", JSON.stringify(locationData));

      setState((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        locationSource: source,
        pendingLocationUpdate: null,
        error: "",
      }));

      console.log("Smart location updated successfully:", { lat, lng, source });
      return true;
    },
    [state.radius, state.lastManualLocation]
  );

  // 新增：拒絕位置更新
  const rejectLocationUpdate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingLocationUpdate: null,
    }));
    console.log("Location update rejected by user");
  }, []);

  // 新增：智能位置設定函數，會詢問用戶是否要切換
  const setSmartLocation = useCallback(
    (lat: number, lng: number, source: "gps" | "network") => {
      // 檢查是否有手動設定的位置
      if (state.lastManualLocation && state.latitude && state.longitude) {
        const distance = calculateDistance(
          state.lastManualLocation.lat,
          state.lastManualLocation.lng,
          lat,
          lng
        );

        console.log(
          `Distance between manual and detected location: ${distance.toFixed(
            2
          )} km`
        );

        // 如果距離超過 2 公里，詢問用戶是否要切換
        if (distance > 2) {
          setState((prev) => ({
            ...prev,
            pendingLocationUpdate: {
              lat,
              lng,
              source,
              distance: Math.round(distance * 10) / 10, // 四捨五入到小數點後一位
            },
          }));

          return false; // 等待用戶確認
        }
      }

      // 直接設定位置（距離不遠或沒有手動設定）
      return confirmLocationUpdate(lat, lng, source);
    },
    [
      state.lastManualLocation,
      state.latitude,
      state.longitude,
      calculateDistance,
      confirmLocationUpdate,
    ]
  );

  const clearLocation = useCallback(() => {
    // 從 localStorage 移除
    localStorage.removeItem("userLocation");

    setState((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
      locationSource: null,
      lastManualLocation: null,
      pendingLocationUpdate: null,
      error: "",
    }));
    console.log("Location cleared");
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: "" }));
  }, []);

  // 新增：檢查是否應該允許自動位置覆蓋
  const shouldAllowAutoOverride = useCallback(() => {
    if (!state.lastManualLocation) return true;

    const timeSinceManual = Date.now() - state.lastManualLocation.timestamp;
    // 手動設定超過 7 天才允許自動覆蓋
    return timeSinceManual > 7 * 24 * 60 * 60 * 1000;
  }, [state.lastManualLocation]);

  return {
    ...state,
    setManualLocation,
    setSmartLocation,
    confirmLocationUpdate,
    rejectLocationUpdate,
    clearLocation,
    clearError,
    setRadius,
    shouldAllowAutoOverride,
  };
};
