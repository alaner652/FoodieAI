"use client";

import { useToastContext } from "@/contexts/ToastContext";
import { useLocation } from "@/hooks/useLocation";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import Button from "./ui/Button";

export default function LocationSettings() {
  const location = useLocation();
  const { showSuccess, showError } = useToastContext();
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAutoLocation = async () => {
    try {
      await location.handleGetLocation();
    } catch (error) {
      console.error("Auto location failed:", error);
    }
  };

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
    }
  };

  const handleClearLocation = () => {
    location.clearLocation();
    showSuccess("位置已清除", "位置設定");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">位置偏好管理</h3>
          {location.latitude && location.longitude && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              已設定
            </span>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
        >
          {isExpanded ? "收起" : "展開"}
        </Button>
      </div>

      {/* Current Location Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">目前位置狀態</h4>

        {location.latitude && location.longitude ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                位置已設定
              </span>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              <p>緯度: {location.latitude.toFixed(6)}</p>
              <p>經度: {location.longitude.toFixed(6)}</p>
              <p>
                來源:{" "}
                {location.locationSource === "manual" ? "手動設定" : "自動偵測"}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-800">尚未設定位置</span>
            </div>
          </div>
        )}

        {location.permissionStatus && (
          <div className="mt-3 text-xs text-gray-600">
            權限狀態:{" "}
            {location.permissionStatus === "granted"
              ? "已允許"
              : location.permissionStatus === "denied"
              ? "已拒絕"
              : "等待確認"}
          </div>
        )}

        {location.error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">
                錯誤: {location.error}
              </span>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Auto Location */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              自動位置偵測
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              使用瀏覽器的地理位置 API 自動偵測您的位置
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleAutoLocation}
                disabled={location.isGettingLocation}
                size="sm"
              >
                {location.isGettingLocation ? "偵測中..." : "自動偵測位置"}
              </Button>
              {location.latitude && location.longitude && (
                <Button
                  variant="outline"
                  onClick={handleClearLocation}
                  size="sm"
                >
                  清除位置
                </Button>
              )}
            </div>
          </div>

          {/* Manual Location */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              手動輸入位置
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              您可以手動輸入經緯度座標
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">緯度</label>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="例如: 25.0330"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">經度</label>
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="例如: 121.5654"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            <Button
              onClick={handleManualLocation}
              disabled={!manualLat || !manualLng}
              size="sm"
            >
              設定手動位置
            </Button>
          </div>

          {/* Instructions */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              如何獲取座標？
            </h4>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>前往 Google Maps</li>
              <li>搜尋或點擊您想要的位置</li>
              <li>右鍵點擊該位置，選擇座標數值複製</li>
              <li>將座標分別貼入上方的緯度和經度欄位</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
