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
    source: "gps" | "network" | "manual";
    distance: number;
    updateDirection?: "toReal" | "toManual";
  } | null;
}

// 全域位置變更監聽器
const locationChangeListeners = new Set<(lat: number, lng: number) => void>();

export const addLocationChangeListener = (callback: (lat: number, lng: number) => void) => {
  locationChangeListeners.add(callback);
  return () => {
    locationChangeListeners.delete(callback);
  };
};

const notifyLocationChange = (lat: number, lng: number) => {
  // 延遲到下一個事件循環，避免在渲染期間更新狀態
  setTimeout(() => {
    locationChangeListeners.forEach(callback => callback(lat, lng));
  }, 0);
};

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


  // Initialize location from localStorage on mount and auto-get location
  useEffect(() => {
    let hasLocation = false;

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
          hasLocation = true;
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

    // 如果沒有有效的儲存位置，自動嘗試獲取當前位置
    if (!hasLocation && navigator.geolocation) {
      setState((prev) => ({ ...prev, isGettingLocation: true }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setState((prev) => {
            const now = Date.now();
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

            try {
              localStorage.setItem("userLocation", JSON.stringify(locationData));
              console.log("Auto-location set successfully:", { latitude, longitude });
              // 通知所有監聽器位置已變更
              notifyLocationChange(latitude, longitude);
            } catch (error) {
              console.error("Failed to save auto-location:", error);
            }

            return newState;
          });
        },
        (error) => {
          setState((prev) => ({
            ...prev,
            isGettingLocation: false,
            error: "無法獲取位置，請手動設定"
          }));
          console.log("Auto-location failed (silent):", error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  }, []);

  const setRadius = useCallback(
    (newRadius: number) => {
      // 驗證半徑範圍 (0.2 公里到 5 公里)
      if (newRadius < 0.2 || newRadius > 5) {
        showError("半徑必須在 0.2 到 5 公里之間", "半徑設定錯誤");
        return false;
      }

      setState((prev) => {
        // 立即更新狀態，然後更新 localStorage
        const newState = { ...prev, radius: newRadius };

        // 如果已經有位置設定，更新 localStorage
        if (prev.latitude && prev.longitude) {
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

        return newState;
      });

      console.log("Radius updated to:", newRadius, "km");
      return true;
    },
    [showError]
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

      setState((prev) => {
        // 記錄手動設定的位置和時間
        const manualLocation = { lat, lng, timestamp: now };

        // 建立新狀態
        const newState = {
          ...prev,
          latitude: lat,
          longitude: lng,
          locationSource: "manual" as const,
          lastManualLocation: manualLocation,
          pendingLocationUpdate: null, // 清除待確認的更新
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

        try {
          localStorage.setItem("userLocation", JSON.stringify(locationData));
          console.log("Manual location set successfully:", { lat, lng });
          // 通知所有監聽器位置已變更
          notifyLocationChange(lat, lng);
        } catch (error) {
          console.error("Failed to save location to localStorage:", error);
        }

        return newState;
      });

      return true;
    },
    [showError]
  );

  // 新增：確認位置更新
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

        try {
          localStorage.setItem("userLocation", JSON.stringify(locationData));
          // 通知所有監聽器位置已變更
          notifyLocationChange(lat, lng);
        } catch (error) {
          console.error("Failed to save location to localStorage:", error);
        }

        console.log("Location updated successfully:", { lat, lng, source });
        return newState;
      });

      return true;
    },
    []
  );

  // 新增：拒絕位置更新
  const rejectLocationUpdate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingLocationUpdate: null,
    }));
    console.log("Location update rejected by user");
  }, []);

  // 簡化的智能位置設定函數
  const setSmartLocation = useCallback(
    (lat: number, lng: number, source: "gps" | "network" | "manual") => {
      // 直接更新位置，不做復雜的檢查
      return confirmLocationUpdate(lat, lng, source);
    },
    [confirmLocationUpdate]
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

  // 簡化的位置檢查函數 - 僅在必要時使用
  const checkLocationAccuracy = useCallback(async () => {
    // 如果沒有位置設定，不需要檢查
    if (!state.latitude || !state.longitude) {
      return { needsUpdate: false };
    }

    // 如果已經有待處理的位置更新，不重複檢查
    if (state.pendingLocationUpdate) {
      return { needsUpdate: true };
    }

    // 簡化邏輯：僅在特殊情況下才檢查位置準確性
    // 例如：用戶明確要求檢查位置準確性時
    return { needsUpdate: false };
  }, [state.latitude, state.longitude, state.pendingLocationUpdate]);

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
    checkLocationAccuracy, // 新增
  };
};
