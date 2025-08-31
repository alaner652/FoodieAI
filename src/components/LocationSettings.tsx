"use client";

import { useToastContext } from "@/contexts/ToastContext";
import { useLocation } from "@/hooks/useLocation";
import { CheckCircle, MapPin, RefreshCw } from "lucide-react";
import { useState } from "react";
import Button from "./ui/Button";

export default function LocationSettings() {
  const location = useLocation();
  const { showSuccess, showError } = useToastContext();
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);

  const handleAutoLocation = async () => {
    try {
      setIsAutoDetecting(true);
      await location.handleGetLocation();
      showSuccess("位置已自動偵測完成", "位置設定");
    } catch (error) {
      console.error("Auto location failed:", error);
      showError("自動偵測失敗，請嘗試手動設定", "位置偵測");
    } finally {
      setIsAutoDetecting(false);
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">位置設定</h3>
        <p className="text-sm text-gray-600">
          設定您的位置以獲得附近的餐廳推薦
        </p>
      </div>

      {/* Current Status */}
      {location.latitude && location.longitude ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">位置已設定</span>
          </div>
          <div className="text-xs text-green-700 space-y-1">
            <p>緯度: {location.latitude.toFixed(6)}</p>
            <p>經度: {location.longitude.toFixed(6)}</p>
            <p>來源: {location.locationSource === "manual" ? "手動設定" : "自動偵測"}</p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">尚未設定位置</p>
          {location.error && (
            <p className="text-xs text-red-600 mt-1">錯誤: {location.error}</p>
          )}
        </div>
      )}

      {/* Auto Detection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">自動偵測</h4>
        <Button
          onClick={handleAutoLocation}
          disabled={isAutoDetecting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAutoDetecting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              偵測中...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              自動偵測位置
            </>
          )}
        </Button>
      </div>

      {/* Manual Input */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">手動設定</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">緯度</label>
            <input
              type="number"
              step="any"
              placeholder="25.0330"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">經度</label>
            <input
              type="number"
              step="any"
              placeholder="121.5654"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <Button
          onClick={handleManualLocation}
          disabled={!manualLat || !manualLng}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
        >
          設定位置
        </Button>
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
        
        <div className="text-xs text-gray-500">
          💡 系統會自動偵測位置
        </div>
      </div>
    </div>
  );
}
