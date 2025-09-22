"use client";

import { useToastContext } from "@/contexts/ToastContext";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
    source: "gps" | "network" | "manual";
    distance: number;
    updateDirection?: "toReal" | "toManual";
  } | null;
}

interface LocationContextType extends LocationState {
  setManualLocation: (lat: number, lng: number) => boolean;
  setSmartLocation: (
    lat: number,
    lng: number,
    source: "gps" | "network" | "manual"
  ) => boolean;
  confirmLocationUpdate: (
    lat: number,
    lng: number,
    source: "gps" | "network" | "manual"
  ) => boolean;
  rejectLocationUpdate: () => void;
  clearLocation: () => void;
  clearError: () => void;
  setRadius: (radius: number) => boolean;
  shouldAllowAutoOverride: () => boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// 全域位置變更監聽器
const locationChangeListeners = new Set<(lat: number, lng: number) => void>();

export const addLocationChangeListener = (
  callback: (lat: number, lng: number) => void
) => {
  locationChangeListeners.add(callback);
  return () => {
    locationChangeListeners.delete(callback);
  };
};

const notifyLocationChange = (lat: number, lng: number) => {
  // 使用 queueMicrotask 實現更快的異步更新
  queueMicrotask(() => {
    locationChangeListeners.forEach((callback) => {
      try {
        callback(lat, lng);
      } catch (error) {
        console.error("Location change listener error:", error);
        // 移除有問題的監聽器
        locationChangeListeners.delete(callback);
      }
    });
  });
};

export function LocationProvider({ children }: { children: React.ReactNode }) {
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

  // 同步 localStorage 的輔助函數（防止競態條件）
  const syncToLocalStorage = useCallback(
    (locationData: {
      latitude: number;
      longitude: number;
      locationSource: "gps" | "network" | "manual" | null;
      radius: number;
      timestamp: number;
      lastManualLocation?: {
        lat: number;
        lng: number;
        timestamp: number;
      } | null;
    }) => {
      // 使用 queueMicrotask 確保同步操作在下一個微任務中執行
      queueMicrotask(() => {
        try {
          const currentData = localStorage.getItem("userLocation");
          let shouldUpdate = true;

          // 檢查是否需要更新（避免不必要的寫入）
          if (currentData) {
            try {
              const existing = JSON.parse(currentData);
              // 如果新數據的時間戳較舊，不進行更新
              if (
                existing.timestamp &&
                locationData.timestamp &&
                existing.timestamp >= locationData.timestamp
              ) {
                shouldUpdate = false;
              }
            } catch {
              // 如果解析失敗，強制更新
              shouldUpdate = true;
            }
          }

          if (shouldUpdate) {
            localStorage.setItem("userLocation", JSON.stringify(locationData));
          }
        } catch (error) {
          console.error("Failed to sync location to localStorage:", error);
        }
      });
    },
    []
  );

  // 從 localStorage 恢復位置
  const restoreLocationFromStorage = useCallback(() => {
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
          return true;
        } else if (isExpired) {
          localStorage.removeItem("userLocation");
        }
      }
    } catch (error) {
      console.error("Failed to restore location from localStorage:", error);
      // 移除損壞的資料
      localStorage.removeItem("userLocation");
    }
    return false;
  }, []);

  // 自動獲取位置
  const autoGetLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    setState((prev) => ({ ...prev, isGettingLocation: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const now = Date.now();

        setState((prev) => {
          const newState = {
            ...prev,
            latitude,
            longitude,
            locationSource: "gps" as const,
            isGettingLocation: false,
            error: "",
          };

          // 自動儲存獲取的位置
          const locationData = {
            latitude,
            longitude,
            locationSource: "gps" as const,
            radius: prev.radius,
            timestamp: now,
            lastManualLocation: prev.lastManualLocation,
          };

          syncToLocalStorage(locationData);
          notifyLocationChange(latitude, longitude);

          return newState;
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          isGettingLocation: false,
          error: "無法獲取位置，請手動設定",
        }));
        console.log("Auto-location failed (silent):", error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [syncToLocalStorage]);

  // 初始化位置
  useEffect(() => {
    const hasStoredLocation = restoreLocationFromStorage();

    // 如果沒有儲存的位置，嘗試自動獲取
    if (!hasStoredLocation) {
      autoGetLocation();
    }
  }, [restoreLocationFromStorage, autoGetLocation]);

  // 設定半徑
  const setRadius = useCallback(
    (newRadius: number) => {
      // 驗證半徑範圍 (0.2 公里到 5 公里)
      if (newRadius < 0.2 || newRadius > 5) {
        showError("半徑必須在 0.2 到 5 公里之間", "半徑設定錯誤");
        return false;
      }

      setState((prev) => {
        const newState = { ...prev, radius: newRadius };

        // 如果已經有位置設定，更新 localStorage
        if (prev.latitude && prev.longitude) {
          const locationData = {
            latitude: prev.latitude,
            longitude: prev.longitude,
            locationSource: prev.locationSource,
            radius: newRadius,
            timestamp: Date.now(),
            lastManualLocation: prev.lastManualLocation,
          };
          syncToLocalStorage(locationData);
        }

        return newState;
      });

      return true;
    },
    [showError, syncToLocalStorage]
  );

  // 手動設定位置
  const setManualLocation = useCallback(
    (lat: number, lng: number) => {
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        const errorMsg = "Coordinates out of valid range";
        setState((prev) => ({ ...prev, error: errorMsg }));
        showError(errorMsg, "無效座標");
        return false;
      }

      const now = Date.now();
      const manualLocation = { lat, lng, timestamp: now };

      setState((prev) => {
        const newState = {
          ...prev,
          latitude: lat,
          longitude: lng,
          locationSource: "manual" as const,
          lastManualLocation: manualLocation,
          pendingLocationUpdate: null,
          error: "",
        };

        // 同步儲存到 localStorage
        const locationData = {
          latitude: lat,
          longitude: lng,
          locationSource: "manual" as const,
          radius: prev.radius,
          timestamp: now,
          lastManualLocation: manualLocation,
        };

        syncToLocalStorage(locationData);
        notifyLocationChange(lat, lng);

        return newState;
      });

      return true;
    },
    [showError, syncToLocalStorage]
  );

  // 確認位置更新
  const confirmLocationUpdate = useCallback(
    (lat: number, lng: number, source: "gps" | "network" | "manual") => {
      const now = Date.now();

      setState((prev) => {
        const newState = {
          ...prev,
          latitude: lat,
          longitude: lng,
          locationSource: source,
          pendingLocationUpdate: null,
          error: "",
        };

        // 同步更新 localStorage
        const locationData = {
          latitude: lat,
          longitude: lng,
          locationSource: source,
          radius: prev.radius,
          timestamp: now,
          lastManualLocation: prev.lastManualLocation,
        };

        syncToLocalStorage(locationData);
        notifyLocationChange(lat, lng);

        return newState;
      });

      return true;
    },
    [syncToLocalStorage]
  );

  // 拒絕位置更新
  const rejectLocationUpdate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingLocationUpdate: null,
    }));
  }, []);

  // 智能位置設定（簡化版本，直接調用 confirmLocationUpdate）
  const setSmartLocation = confirmLocationUpdate;

  // 清除位置
  const clearLocation = useCallback(() => {
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
  }, []);

  // 清除錯誤
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: "" }));
  }, []);

  // 檢查是否應該允許自動位置覆蓋（簡化版本）
  const shouldAllowAutoOverride = useCallback(() => {
    if (!state.lastManualLocation) return true;
    const timeSinceManual = Date.now() - state.lastManualLocation.timestamp;
    return timeSinceManual > 7 * 24 * 60 * 60 * 1000; // 7天
  }, [state.lastManualLocation]);

  const contextValue: LocationContextType = {
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

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
