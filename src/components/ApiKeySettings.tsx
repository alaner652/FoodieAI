"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Eye, EyeOff, Info, Key, Save, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
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

  // Read saved API Keys from localStorage
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
    setTimeout(() => setIsSaved(false), 3000);
  }, [googleApiKey, geminiApiKey]);

  const handleReset = useCallback(() => {
    setGoogleApiKey("");
    setGeminiApiKey("");
    localStorage.removeItem("userGoogleApiKey");
    localStorage.removeItem("userGeminiKey");
  }, []);

  const isConfigured = googleApiKey && geminiApiKey;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">API 金鑰管理</h3>
          {isConfigured && (
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

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-3 rounded-lg border ${
          googleApiKey ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center space-x-2">
            {googleApiKey ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
            <span className="text-sm font-medium">
              Google Places API: {googleApiKey ? '已設定' : '未設定'}
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${
          geminiApiKey ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center space-x-2">
            {geminiApiKey ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
            <span className="text-sm font-medium">
              Gemini AI API: {geminiApiKey ? '已設定' : '未設定'}
            </span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-800">
            設定 API 金鑰以啟用完整的餐廳推薦功能
          </p>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Google Places API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Places API Key
            </label>
            <Input
              type={showGoogleKey ? "text" : "password"}
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
              placeholder="輸入您的 Google Places API Key"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gemini AI API Key
            </label>
            <Input
              type={showGeminiKey ? "text" : "password"}
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="輸入您的 Gemini API Key"
              leftIcon={Key}
              rightIcon={showGeminiKey ? EyeOff : Eye}
              onRightIconClick={() => setShowGeminiKey(!showGeminiKey)}
            />
            <p className="mt-1 text-xs text-gray-500">
              用於 AI 智能推薦和餐廳排序分析
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              保存設定
            </Button>
            
            <Button variant="outline" onClick={handleReset} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              重置
            </Button>
          </div>

          {/* Save Success Message */}
          {isSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                ✅ 設定已保存！
              </p>
            </div>
          )}

          {/* Help Links */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">如何獲取 API Keys？</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <p>
                <strong>Google Places API:</strong>{" "}
                <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  前往 Google Cloud Console
                </a>
              </p>
              <p>
                <strong>Gemini API:</strong>{" "}
                <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  前往 Google AI Studio
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
