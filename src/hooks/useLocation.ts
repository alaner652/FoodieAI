import { useToastContext } from "@/contexts/ToastContext";
import { useCallback, useEffect, useState } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  locationSource: "gps" | "network" | "manual" | null;
  isGettingLocation: boolean;
  error: string;
  radius: number; // 新增半徑設定
}

export const useLocation = () => {
  const { showError } = useToastContext();
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    locationSource: null,
    isGettingLocation: false,
    error: "",
    radius: 1.5, // 預設半徑為 1.5 公里
  });

  // Track location watcher ID
  // const watchIdRef = useRef<number | null>(null); // This line was removed

  // Initialize location from localStorage on mount
  useEffect(() => {
    try {
      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        const { latitude, longitude, locationSource, timestamp, radius } =
          locationData;

        // Check if location data is still valid (not older than 24 hours)
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;

        if (!isExpired && latitude && longitude) {
          setState((prev) => ({
            ...prev,
            latitude,
            longitude,
            locationSource,
            radius: radius || 1.5, // 如果沒有半徑設定，使用預設值 1.5 公里
            error: "",
          }));
          console.log("Location restored from localStorage:", locationData);
        } else if (isExpired) {
          // Remove expired location data
          localStorage.removeItem("userLocation");
          console.log("Expired location data removed from localStorage");
        }
      }
    } catch (error) {
      console.error("Failed to restore location from localStorage:", error);
      // Remove corrupted data
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

      // Save to localStorage for persistence
      const locationData = {
        latitude: lat,
        longitude: lng,
        locationSource: "manual" as const,
        radius: state.radius,
        timestamp: Date.now(),
      };
      localStorage.setItem("userLocation", JSON.stringify(locationData));

      setState((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        locationSource: "manual",
        error: "",
      }));

      console.log("Manual location set successfully:", { lat, lng });
      return true;
    },
    [state.radius, showError]
  );

  const clearLocation = useCallback(() => {
    // Remove from localStorage
    localStorage.removeItem("userLocation");

    setState((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
      locationSource: null,
      error: "",
    }));
    console.log("Location cleared");
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: "" }));
  }, []);

  return {
    ...state,
    setManualLocation,
    clearLocation,
    clearError,
    setRadius,
  };
};
