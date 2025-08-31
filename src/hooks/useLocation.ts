import { UI_CONFIG } from "@/lib/config";
import {
  getSmartLocation,
  LocationResult,
  startLocationTracking,
  stopLocationTracking,
  validateLocation,
} from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  locationSource: "gps" | "network" | "manual" | null;
  isGettingLocation: boolean;
  error: string;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    locationSource: null,
    isGettingLocation: false,
    error: "",
  });

  // 追蹤位置監視器的 ID
  const watchIdRef = useRef<number | null>(null);

  const getLocation = useCallback(async (): Promise<{
    lat: number;
    lng: number;
  }> => {
    try {
      const location = await getSmartLocation({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
        fallbackToLowAccuracy: true,
        maxRetries: 2,
      });

      if (!validateLocation(location.latitude, location.longitude)) {
        throw new Error("取得的位置無效");
      }

      setState((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
        locationSource: location.source,
        error: "",
      }));

      return { lat: location.latitude, lng: location.longitude };
    } catch (error) {
      console.error("智能定位失敗:", error);
      throw error;
    }
  }, []);

  const handleGetLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isGettingLocation: true, error: "" }));

    try {
      const loc = await getLocation();
      console.log("位置取得成功:", loc);
    } catch (error) {
      console.error("取得位置失敗:", error);
      setState((prev) => ({
        ...prev,
        error: UI_CONFIG.ERROR_MESSAGES.LOCATION_FAILED,
      }));
    } finally {
      setState((prev) => ({ ...prev, isGettingLocation: false }));
    }
  }, [getLocation]);

  const startLocationWatch = useCallback(() => {
    try {
      // 如果已經有監視器在運行，先停止它
      if (watchIdRef.current !== null) {
        stopLocationTracking(watchIdRef.current);
      }

      watchIdRef.current = startLocationTracking(
        (location: LocationResult) => {
          if (validateLocation(location.latitude, location.longitude)) {
            setState((prev) => ({
              ...prev,
              latitude: location.latitude,
              longitude: location.longitude,
              locationSource: location.source,
            }));
            console.log("位置更新:", location);
          }
        },
        (error: Error) => {
          console.error("位置追蹤失敗:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    } catch (error) {
      console.error("啟動位置追蹤失敗:", error);
    }
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number) => {
    if (!validateLocation(lat, lng)) {
      setState((prev) => ({ ...prev, error: "座標超出有效範圍" }));
      return false;
    }

    setState((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      locationSource: "manual",
      error: "",
    }));

    console.log("手動設定位置成功:", { lat, lng });
    return true;
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: "" }));
  }, []);

  const stopLocationWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      stopLocationTracking(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // 組件卸載時清理位置追蹤
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        stopLocationTracking(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...state,
    getLocation,
    handleGetLocation,
    startLocationWatch,
    stopLocationWatch,
    setManualLocation,
    clearError,
  };
};
