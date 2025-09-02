import { useToastContext } from "@/contexts/ToastContext";
import { useCallback, useEffect, useState } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  locationSource: "gps" | "network" | "manual" | null;
  isGettingLocation: boolean;
  error: string;
  radius: number;
  lastManualLocation: { lat: number; lng: number; timestamp: number } | null; // 新增：記錄最後手動設定的位置
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
    lastManualLocation: null, // 新增
  });

  // Initialize location from localStorage on mount
  useEffect(() => {
    try {
      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        const { latitude, longitude, locationSource, timestamp, radius, lastManualLocation } = locationData;

        // 檢查位置資料是否仍然有效（不超過 24 小時）
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;

        if (!isExpired && latitude && longitude) {
          setState((prev) => ({
            ...prev,
            latitude,
            longitude,
            locationSource,
            radius: radius || 1.5,
            lastManualLocation: lastManualLocation || null, // 恢復手動設定記錄
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
        lastManualLocation: manualLocation, // 記錄手動設定
      };
      localStorage.setItem("userLocation", JSON.stringify(locationData));

      setState((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        locationSource: "manual",
        lastManualLocation: manualLocation, // 更新狀態
        error: "",
      }));

      console.log("Manual location set successfully:", { lat, lng });
      return true;
    },
    [state.radius, showError]
  );

  // 新增：智能位置設定函數
  const setSmartLocation = useCallback(
    (lat: number, lng: number, source: "gps" | "network") => {
      // 檢查是否有手動設定的位置
      if (state.lastManualLocation) {
        const manualTime = state.lastManualLocation.timestamp;
        const now = Date.now();
        const timeSinceManual = now - manualTime;
        
        // 如果手動設定在 7 天內，則不覆蓋
        if (timeSinceManual < 7 * 24 * 60 * 60 * 1000) {
          console.log("Manual location is recent, not overriding with auto-detection");
          return false;
        }
        
        // 如果手動設定超過 7 天，詢問用戶是否要更新
        console.log("Manual location is old, suggesting update");
      }

      // 儲存自動偵測的位置
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
        error: "",
      }));

      console.log("Smart location set successfully:", { lat, lng, source });
      return true;
    },
    [state.radius, state.lastManualLocation]
  );

  const clearLocation = useCallback(() => {
    // 從 localStorage 移除
    localStorage.removeItem("userLocation");

    setState((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
      locationSource: null,
      lastManualLocation: null, // 清除手動設定記錄
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
    setSmartLocation, // 新增
    clearLocation,
    clearError,
    setRadius,
    shouldAllowAutoOverride, // 新增
  };
};
