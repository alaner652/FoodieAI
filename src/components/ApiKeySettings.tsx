"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Eye, EyeOff, Info, Key, Save, Settings } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ApiKeySettingsProps {
  className?: string;
}

export default function ApiKeySettings({
  className = "",
}: ApiKeySettingsProps) {
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // 從 localStorage 讀取已保存的 API Keys
  useEffect(() => {
    const savedGoogleKey = localStorage.getItem("userGoogleApiKey") || "";
    const savedGeminiKey = localStorage.getItem("userGeminiKey") || "";
    setGoogleApiKey(savedGoogleKey);
    setGeminiApiKey(savedGeminiKey);
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem("userGoogleApiKey", googleApiKey);
    localStorage.setItem("userGeminiKey", geminiApiKey);
    setIsSaved(true);

    // 3秒後隱藏保存成功提示
    setTimeout(() => setIsSaved(false), 3000);
  }, [googleApiKey, geminiApiKey]);

  const handleReset = useCallback(() => {
    setGoogleApiKey("");
    setGeminiApiKey("");
    localStorage.removeItem("userGoogleApiKey");
    localStorage.removeItem("userGeminiKey");
  }, []);

  const hasCustomKeys = googleApiKey || geminiApiKey;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}
    >
      {/* 標題和展開按鈕 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">API 設定</h3>
          {hasCustomKeys && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              已設定
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isExpanded ? "收起" : "展開"}
        </button>
      </div>

      {/* 說明文字 */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">重要：API Keys 是必要的</p>
            <p className="text-blue-700 mb-2">
              為了提供更好的服務體驗，請設定您的 Google Places API Key 和 Gemini
              API Key。
            </p>
            <p className="text-blue-700 text-xs">
              <strong>注意：</strong> 如果沒有設定 API
              Keys，餐廳推薦功能將無法使用。
            </p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Google Places API Key */}
          <div>
            <Input
              type={showGoogleKey ? "text" : "password"}
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
              placeholder="輸入您的 Google Places API Key"
              label="Google Places API Key"
              leftIcon={Key}
              rightIcon={showGoogleKey ? EyeOff : Eye}
              onRightIconClick={() => setShowGoogleKey(!showGoogleKey)}
            />
            <p className="mt-1 text-xs text-gray-500">
              用於搜尋附近餐廳和獲取餐廳詳細資訊
            </p>
          </div>

          {/* Gemini API Key */}
          <div>
            <Input
              type={showGeminiKey ? "text" : "password"}
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="輸入您的 Gemini API Key"
              label="Gemini API Key"
              leftIcon={Key}
              rightIcon={showGeminiKey ? EyeOff : Eye}
              onRightIconClick={() => setShowGeminiKey(!showGeminiKey)}
            />
            <p className="mt-1 text-xs text-gray-500">
              用於 AI 智能推薦和餐廳排序分析
            </p>
          </div>

          {/* 操作按鈕 */}
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={handleSave}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>保存設定</span>
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>

          {/* 保存成功提示 */}
          {isSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                ✅ 設定已保存！
              </p>
            </div>
          )}

          {/* 使用說明 */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              如何獲取 API Keys？
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                • <strong>Google Places API Key:</strong> 前往{" "}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Cloud Console
                </a>{" "}
                啟用 Places API
              </p>
              <p>
                • <strong>Gemini API Key:</strong> 前往{" "}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>{" "}
                獲取 API Key
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
