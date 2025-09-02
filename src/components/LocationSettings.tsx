"use client";

import { useToastContext } from "@/contexts/ToastContext";
import { useLocation } from "@/hooks/useLocation";
import { CheckCircle, MapPin, Target } from "lucide-react";
import { useState } from "react";
import LocationMap from "./LocationMap";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { Slider } from "./ui/slider";

export default function LocationSettings() {
  const location = useLocation();
  const { showSuccess, showError } = useToastContext();
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [showMap, setShowMap] = useState(false);

  const radiusOptions = [0.5, 1, 1.5, 2, 3];

  // 預設位置（台北市中心）
  const defaultLat = 25.033;
  const defaultLng = 121.5654;

  const handleManualLocation = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      showError("請輸入有效的緯度和經度數值", "輸入錯誤");
      return;
    }

    if (lat < -90 || lat > 90) {
      showError("緯度必須在 -90 到 90 之間", "緯度錯誤");
      return;
    }

    if (lng < -180 || lng > 180) {
      showError("經度必須在 -180 到 180 之間", "經度錯誤");
      return;
    }

    const success = location.setManualLocation(lat, lng);
    if (success) {
      showSuccess(
        `位置已設定為 ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        "位置設定成功"
      );
      setManualLat("");
      setManualLng("");
      setShowMap(false);
    }
  };

  const handleMapLocationChange = (lat: number, lng: number) => {
    setManualLat(lat.toFixed(6));
    setManualLng(lng.toFixed(6));
  };

  const handleClearLocation = () => {
    location.clearLocation();
    showSuccess("位置已清除", "位置設定");
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
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {location.radius} km
              </div>
              <div className="text-xs text-gray-500">搜尋半徑</div>
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
              <div className="text-xs text-gray-500">預設半徑</div>
            </div>
          </div>
        )}
      </div>

      {/* Radius Control */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <Target className="w-5 h-5 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-900">調整搜尋範圍</h4>
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

          {/* Quick Options */}
          <div className="flex flex-wrap gap-2">
            {radiusOptions.map((radius) => (
              <button
                key={radius}
                onClick={() => location.setRadius(radius)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.radius === radius
                    ? "bg-orange-500 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300"
                }`}
              >
                {radius} km
              </button>
            ))}
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
          {/* Map Toggle Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowMap(!showMap)}
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              {showMap ? "隱藏地圖" : "顯示地圖選擇"}
            </Button>
          </div>

          {/* Interactive Map */}
          {showMap && (
            <div className="relative">
              <LocationMap
                latitude={location.latitude || defaultLat}
                longitude={location.longitude || defaultLng}
                onLocationChange={handleMapLocationChange}
                className="mb-4"
              />
            </div>
          )}

          {/* Manual Input */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  緯度
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="25.0330"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  經度
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="121.5654"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                onClick={handleManualLocation}
                disabled={!manualLat || !manualLng}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                設定位置
              </Button>

              <div className="text-xs text-gray-500">💡 點擊地圖或輸入座標</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handleClearLocation}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          清除位置
        </Button>

        <div className="text-xs text-gray-500">設定會自動暫存</div>
      </div>
    </Card>
  );
}
