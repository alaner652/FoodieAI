import { useToastContext } from "@/contexts/ToastContext";
import { UI_CONFIG } from "@/lib/config";
import {
  checkLocationPermission,
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
  permissionStatus: PermissionState | null;
}

export const useLocation = () => {
  const { showError, showSuccess } = useToastContext();
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    locationSource: null,
    isGettingLocation: false,
    error: "",
    permissionStatus: null,
  });

  // Track location watcher ID
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
        throw new Error("Invalid location obtained");
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
      console.error("Smart location failed:", error);
      throw error;
    }
  }, []);

  const handleGetLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isGettingLocation: true, error: "" }));

    try {
      // Check permission first
      const permission = await checkLocationPermission();
      setState((prev) => ({ ...prev, permissionStatus: permission }));

      console.log("Permission status:", permission);

      if (permission === "denied") {
        throw new Error(
          "Location permission denied. Please enable location access in your browser settings."
        );
      }

      const loc = await getLocation();
      console.log("Location obtained successfully:", loc);

      // Update permission status to granted after successful location get
      setState((prev) => ({ ...prev, permissionStatus: "granted" }));

      // Show success toast
      showSuccess("位置偵測成功！", "位置存取");
    } catch (error) {
      console.error("Failed to get location:", error);

      let errorMessage: string = UI_CONFIG.ERROR_MESSAGES.LOCATION_FAILED;
      let errorTitle = "Location Error";

      if (error instanceof Error) {
        if (error.message.includes("denied")) {
          errorMessage =
            "Location permission denied. Please allow location access in your browser and try again.";
          errorTitle = "Permission Denied";
        } else if (error.message.includes("not supported")) {
          errorMessage = "Geolocation is not supported by this browser.";
          errorTitle = "Not Supported";
        }
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      // Show error toast
      showError(errorMessage, errorTitle, 7000); // Longer duration for errors
    } finally {
      setState((prev) => ({ ...prev, isGettingLocation: false }));
    }
  }, [getLocation, showError, showSuccess]);

  const startLocationWatch = useCallback(() => {
    try {
      // If there's already a watcher running, stop it first
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
            console.log("Location updated:", location);
          }
        },
        (error: Error) => {
          console.error("Location tracking failed:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    } catch (error) {
      console.error("Failed to start location tracking:", error);
    }
  }, []);

  const setManualLocation = useCallback(
    (lat: number, lng: number) => {
      if (!validateLocation(lat, lng)) {
        const errorMsg = "Coordinates out of valid range";
        setState((prev) => ({
          ...prev,
          error: errorMsg,
        }));
        showError(errorMsg, "無效座標");
        return false;
      }

      setState((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        locationSource: "manual",
        error: "",
      }));

      console.log("Manual location set successfully:", { lat, lng });
      showSuccess(
        `Location set to ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        "Manual Location"
      );
      return true;
    },
    [showError, showSuccess]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: "" }));
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const permission = await checkLocationPermission();
      setState((prev) => ({ ...prev, permissionStatus: permission }));
      return permission;
    } catch (error) {
      console.error("Failed to check permission:", error);
      return "prompt";
    }
  }, []);

  const stopLocationWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      stopLocationTracking(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Clean up location tracking when component unmounts
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
    checkPermission,
  };
};
