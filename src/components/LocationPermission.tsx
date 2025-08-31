import { useToastContext } from "@/contexts/ToastContext";
import { useLocation } from "@/hooks/useLocation";
import { useEffect, useState } from "react";

interface LocationPermissionnProps {
  onLocationObtained?: (lat: number, lng: number) => void;
}

export default function LocationPermission({
  onLocationObtained,
}: LocationPermissionnProps) {
  const location = useLocation();
  const { showError } = useToastContext();

  const [hasAttemptedAutoLocation, setHasAttemptedAutoLocation] =
    useState(false);

  useEffect(() => {
    // Auto-attempt to get location silently when component mounts
    if (
      !hasAttemptedAutoLocation &&
      !location.latitude &&
      !location.longitude
    ) {
      setHasAttemptedAutoLocation(true);
      // Silently attempt to get location
      if (location.permissionStatus !== "denied") {
        location.handleGetLocationSilent();
      }
    }
  }, [hasAttemptedAutoLocation, location.permissionStatus, location]);

  useEffect(() => {
    // Call callback when location is obtained
    if (location.latitude && location.longitude && onLocationObtained) {
      onLocationObtained(location.latitude, location.longitude);
    }
  }, [location.latitude, location.longitude, onLocationObtained]);

  useEffect(() => {
    // Show error toast only when there's a problem and user has attempted location
    if (
      hasAttemptedAutoLocation &&
      location.error &&
      !location.isGettingLocation
    ) {
      if (location.permissionStatus === "denied") {
        showError(
          "位置存取被拒絕，請前往設定頁面手動輸入位置，或在瀏覽器設定中允許位置存取",
          "位置存取失敗",
          10000
        );
      } else {
        showError(
          "無法自動取得位置，請前往設定頁面手動輸入位置",
          "位置偵測失敗",
          8000
        );
      }
    }
  }, [
    hasAttemptedAutoLocation,
    location.error,
    location.isGettingLocation,
    location.permissionStatus,
    showError,
  ]);

  // This component is completely invisible - it only handles automatic location fetching
  // and shows error toasts when needed
  return null;
}
