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
  const { showError, showSuccess } = useToastContext();

  const [hasAttemptedAutoLocation, setHasAttemptedAutoLocation] =
    useState(false);

  useEffect(() => {
    // 第一次進入網站時自動嘗試抓取位置
    if (
      !hasAttemptedAutoLocation &&
      !location.latitude &&
      !location.longitude
    ) {
      setHasAttemptedAutoLocation(true);

      // 檢查瀏覽器是否支援地理位置
      if (!navigator.geolocation) {
        showError("您的瀏覽器不支援地理位置功能", "功能不支援");
        return;
      }

      // 嘗試自動獲取位置
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const success = location.setManualLocation(latitude, longitude);

          if (success) {
            showSuccess(
              `已自動獲取您的位置：${latitude.toFixed(4)}, ${longitude.toFixed(
                4
              )}`,
              "位置設定成功"
            );
          }
        },
        (error) => {
          console.log("Auto location failed:", error);
          // 不顯示錯誤 toast，因為這是自動嘗試，用戶可能不知道
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }
  }, [
    hasAttemptedAutoLocation,
    location.latitude,
    location.longitude,
    location.setManualLocation,
    showError,
    showSuccess,
    location,
  ]);

  useEffect(() => {
    // 當位置被設定時調用回調
    if (location.latitude && location.longitude && onLocationObtained) {
      onLocationObtained(location.latitude, location.longitude);
    }
  }, [location.latitude, location.longitude, onLocationObtained]);

  // 這個組件完全不可見 - 它只處理自動位置抓取
  // 並在需要時顯示錯誤提示
  return null;
}
