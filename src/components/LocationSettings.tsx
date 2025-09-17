"use client";

import { useToastContext } from "@/contexts/ToastContext";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useLocation } from "@/hooks/useLocation";
import { CheckCircle, MapPin, Target } from "lucide-react";
import { useState } from "react";
import LocationMap from "./LocationMap";
import LocationUpdateDialog from "./LocationUpdateDialog";
import Card from "./ui/Card";
import { Slider } from "./ui/slider";

export default function LocationSettings() {
  const location = useLocation();
  const apiKeys = useApiKeys();
  const { showSuccess, showError } = useToastContext();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // 預設位置（台北市中心）
  const defaultLat = 25.033;
  const defaultLng = 121.5654;

  const handleGetCurrentLocation = async () => {
    // 檢查 API keys
    const validation = apiKeys.validateApiKeys();
    if (!validation.isValid) {
      showError(validation.error, "API Key 未設定");
      return;
    }

    if (!navigator.geolocation) {
      showError("您的瀏覽器不支援地理位置功能", "功能不支援");
      return;
    }

    setIsGettingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // 使用智能位置設定，會自動詢問用戶是否要切換
      const success = location.setSmartLocation(latitude, longitude, "gps");

      if (success) {
        showSuccess(
          `已成功獲取您目前位置：${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`,
          "位置設定成功"
        );
      } else if (location.pendingLocationUpdate) {
        // 用戶需要確認位置更新，不需要顯示額外的 toast
        console.log("Location update pending user confirmation");
      }
    } catch (error) {
      console.error("Failed to get location:", error);
      if (error instanceof GeolocationPositionError) {
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
      } else {
        showError("取得位置時發生錯誤", "錯誤");
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleMapLocationChange = (lat: number, lng: number) => {
    // 檢查 API keys
    const validation = apiKeys.validateApiKeys();
    if (!validation.isValid) {
      showError(validation.error, "API Key 未設定");
      return;
    }

    // 地圖上的位置變更應該直接設定，不需要智能檢查
    const success = location.setManualLocation(lat, lng);

    if (success) {
      showSuccess(
        `位置已設定為：${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        "位置設定成功"
      );
    }
  };

  const handleConfirmLocationUpdate = () => {
    if (location.pendingLocationUpdate) {
      const { lat, lng, source } = location.pendingLocationUpdate;
      location.confirmLocationUpdate(lat, lng, source);
      showSuccess("位置已更新", "位置更新成功");
    }
  };

  const handleRejectLocationUpdate = () => {
    location.rejectLocationUpdate();
  };

  // 檢查是否有待確認的位置更新
  const hasPendingUpdate = !!location.pendingLocationUpdate;

  return (
    <div className="space-y-6">
      {/* 位置狀態顯示 */}
      <Card variant="outlined" className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">位置設定</h3>
            <p className="text-sm text-gray-500">
              {location.latitude && location.longitude
                ? "位置已設定"
                : "尚未設定位置"}
            </p>
          </div>
        </div>

        {location.latitude && location.longitude && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">緯度：</span>
                <span className="font-mono text-gray-900">
                  {location.latitude.toFixed(6)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">經度：</span>
                <span className="font-mono text-gray-900">
                  {location.longitude.toFixed(6)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">來源：</span>
                <span className="text-gray-900">
                  {location.locationSource === "gps"
                    ? "GPS"
                    : location.locationSource === "network"
                    ? "網路"
                    : location.locationSource === "manual"
                    ? "手動設定"
                    : "未知"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">搜尋半徑：</span>
                <span className="text-gray-900">{location.radius} 公里</span>
              </div>
            </div>
          </div>
        )}

        {/* 搜尋半徑設定 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            搜尋半徑：{location.radius} 公里
          </label>
          <Slider
            value={[location.radius]}
            onValueChange={(value) => location.setRadius(value[0])}
            min={0.2}
            max={5}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.2 km</span>
            <span>5 km</span>
          </div>
        </div>
      </Card>

      {/* 地圖 */}
      <Card variant="outlined" className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">地圖選擇</h3>
        </div>

        <div className="relative">
          <LocationMap
            latitude={location.latitude || defaultLat}
            longitude={location.longitude || defaultLng}
            onLocationChange={handleMapLocationChange}
          />

          {/* 自動定位按鈕 */}
          <button
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="absolute bottom-4 right-4 w-12 h-12 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 disabled:transform-none"
            title="自動定位"
          >
            {isGettingLocation ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Target className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </Card>

      {/* 位置更新確認對話框 */}
      <LocationUpdateDialog
        isOpen={hasPendingUpdate}
        onClose={handleRejectLocationUpdate}
        onConfirm={handleConfirmLocationUpdate}
        distance={location.pendingLocationUpdate?.distance || 0}
        source={location.pendingLocationUpdate?.source || "gps"}
        updateDirection={location.pendingLocationUpdate?.updateDirection}
      />
    </div>
  );
}
