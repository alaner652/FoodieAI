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
    // 不再自動嘗試抓取位置，只記錄狀態
    if (!hasAttemptedAutoLocation) {
      setHasAttemptedAutoLocation(true);
      console.log(
        "Location permission component initialized - no auto-detection"
      );
    }
  }, [hasAttemptedAutoLocation]);

  useEffect(() => {
    // 當位置被設定時調用回調
    if (location.latitude && location.longitude && onLocationObtained) {
      onLocationObtained(location.latitude, location.longitude);
    }
  }, [location.latitude, location.longitude, onLocationObtained]);

  useEffect(() => {
    // 只在有問題且用戶嘗試過位置偵測時顯示錯誤提示
    if (
      hasAttemptedAutoLocation &&
      location.error &&
      !location.isGettingLocation
    ) {
      // 根據是否有手動設定來決定錯誤訊息
      if (location.lastManualLocation) {
        showError(
          "自動偵測位置失敗，但您有手動設定的位置可以使用",
          "位置偵測提示",
          5000
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
    location.lastManualLocation,
    showError,
  ]);

  // 這個組件完全不可見 - 它只處理位置狀態監聽
  // 不再自動抓取位置，等待用戶主動操作
  return null;
}
