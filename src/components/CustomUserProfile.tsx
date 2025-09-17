"use client";

import { X } from "lucide-react";
import ApiKeySettings from "./ApiKeySettings";
import LocationSettings from "./LocationSettings";

interface CustomUserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomUserProfile({
  isOpen,
  onClose,
}: CustomUserProfileProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">應用程式設定</h2>
            <p className="text-gray-600 mt-1">
              設定您的 API 金鑰和位置偏好以獲得最佳的餐廳推薦體驗
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto space-y-8">
          {/* API Settings */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              API 設定
            </h3>
            <ApiKeySettings />
          </div>

          {/* Location Settings */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              位置設定
            </h3>
            <LocationSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
