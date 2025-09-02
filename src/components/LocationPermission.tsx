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

  const [hasAttemptedAutoLocation, setHasAttemptedAutoLocation] = useState(() => {
    // 從 localStorage 檢查是否已經嘗試過自動抓取
    if (typeof window !== "undefined") {
      return localStorage.getItem("hasAttemptedAutoLocation") === "true";
    }
    return false;
  });

  useEffect(() => {
    console.log("LocationPermission useEffect triggered", {
      hasAttemptedAutoLocation,
      hasLocation: !!(location.latitude && location.longitude),
      latitude: location.latitude,
      longitude: location.longitude,
    });

    // 只在第一次進入網站且沒有位置設定時嘗試自動抓取
    if (
      !hasAttemptedAutoLocation &&
      !location.latitude &&
      !location.longitude
    ) {
      console.log("Attempting to get location automatically...");
      setHasAttemptedAutoLocation(true);
      
      // 記錄到 localStorage，避免下次進入時重複嘗試
      localStorage.setItem("hasAttemptedAutoLocation", "true");

      // 檢查瀏覽器是否支援地理位置
      if (!navigator.geolocation) {
        console.log("Geolocation not supported");
        showError("您的瀏覽器不支援地理位置功能", "功能不支援");
        return;
      }

      console.log("Geolocation supported, requesting position...");

      // 嘗試自動獲取位置
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Position obtained:", position.coords);
          const { latitude, longitude } = position.coords;
          const success = location.setManualLocation(latitude, longitude);

          if (success) {
            console.log("Location set successfully");
            showSuccess(
              `已自動獲取您的位置：${latitude.toFixed(4)}, ${longitude.toFixed(
                4
              )}`,
              "位置設定成功"
            );
          } else {
            console.log("Failed to set location");
          }
        },
        (error) => {
          console.log("Auto location failed:", error);
          // 顯示錯誤信息，讓用戶知道發生了什麼
          switch (error.code) {
            case error.PERMISSION_DENIED:
              showError(
                "位置權限被拒絕，請在瀏覽器設定中允許位置存取",
                "權限錯誤"
              );
              break;
            case error.POSITION_UNAVAILABLE:
              showError("無法取得位置資訊，請檢查您的網路連線", "位置不可用");
              break;
            case error.TIMEOUT:
              showError("取得位置超時，請重試", "超時錯誤");
              break;
            default:
              showError("取得位置時發生未知錯誤", "未知錯誤");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else if (hasAttemptedAutoLocation) {
      console.log("Auto location already attempted, skipping...");
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
      console.log(
        "Location obtained callback triggered:",
        location.latitude,
        location.longitude
      );
      onLocationObtained(location.latitude, location.longitude);
    }
  }, [location.latitude, location.longitude, onLocationObtained]);

  // 這個組件完全不可見 - 它只處理自動位置抓取
  // 並在需要時顯示錯誤提示
  return null;
}
