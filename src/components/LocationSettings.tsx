"use client";

import { useToastContext } from "@/contexts/ToastContext";
import { useLocation } from "@/hooks/useLocation";
import { CheckCircle, MapPin, Target } from "lucide-react";
import { useState } from "react";
import LocationMap from "./LocationMap";
import Card from "./ui/Card";
import { Slider } from "./ui/slider";

export default function LocationSettings() {
  const location = useLocation();
  const { showSuccess, showError } = useToastContext();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // 預設位置（台北市中心）
  const defaultLat = 25.033;
  const defaultLng = 121.5654;

  const handleGetCurrentLocation = async () => {
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
      const success = location.setManualLocation(latitude, longitude);

      if (success) {
        showSuccess(
          `已成功獲取您目前位置：${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`,
          "位置設定成功"
        );
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
    // 直接設定地圖點擊的位置
    const success = location.setManualLocation(lat, lng);
    if (success) {
      showSuccess(
        `位置已設定為：${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        "位置設定成功"
      );
    }
  };

  return (
    <Card variant="outlined" className="p-6">
      {/* Status & Radius Combined */}
      <div className="mb-4">
        {location.latitude && location.longitude ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    位置已設定
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {location.locationSource === "manual"
                      ? "手動設定"
                      : "自動偵測"}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </div>
                {/* 簡化的手動設定保護狀態提示 */}
                {location.lastManualLocation && (
                  <div className="text-xs text-blue-600 mt-1">
                    🛡️ 7天內受保護
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {location.radius} km
              </div>
              <div className="text-xs text-gray-500">半徑</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-semibold text-gray-700">尚未設定位置</div>
                <div className="text-sm text-gray-600">
                  請輸入座標或使用地圖選擇
                </div>
                {location.error && (
                  <div className="text-xs text-red-600 mt-1">
                    ⚠️ {location.error}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-400">
                {location.radius} km
              </div>
              <div className="text-xs text-gray-500">半徑</div>
            </div>
          </div>
        )}
      </div>

      {/* Radius Control */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <Target className="w-5 h-5 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-900">搜尋範圍</h4>
        </div>

        <div className="space-y-3">
          {/* Slider */}
          <div className="px-2">
            <Slider
              value={[location.radius]}
              onValueChange={(values) => {
                const newRadius = values[0];
                if (newRadius !== undefined) {
                  location.setRadius(newRadius);
                }
              }}
              min={0.2}
              max={5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0.2 km</span>
              <span>5 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Input */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <MapPin className="w-5 h-5 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-900">設定位置</h4>
        </div>

        <div className="space-y-4">
          {/* Interactive Map - 始終顯示 */}
          <div className="relative">
            <LocationMap
              latitude={location.latitude || defaultLat}
              longitude={location.longitude || defaultLng}
              onLocationChange={handleMapLocationChange}
              className="mb-4"
            />

            {/* 定位按鈕 - 放在地圖右下角，更顯眼 */}
            <button
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="absolute bottom-4 right-4 w-12 h-12 bg-orange-500 hover:bg-orange-600 border-2 border-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              title="定位到目前位置"
            >
              {isGettingLocation ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* 提示說明 */}
          <div className="text-center text-sm text-gray-500">
            💡 點擊地圖選擇位置，或點擊右上角定位圖示自動獲取
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center items-center">
        <div className="text-xs text-gray-500">設定會自動暫存</div>
      </div>
    </Card>
  );
}
