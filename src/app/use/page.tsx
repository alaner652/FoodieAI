"use client";

import Features from "@/components/Features";
import Footer from "@/components/Footer";
import LocationDistanceChecker from "@/components/LocationDisplay";
import LocationPermission from "@/components/LocationPermission";
import LocationUpdateDialog from "@/components/LocationUpdateDialog";
import QuickSuggestions from "@/components/QuickSuggestions";
import RecommendationResults from "@/components/RecommendationResults";
import SearchInput from "@/components/SearchInput";

import Container from "@/components/ui/Container";
import { useToastContext } from "@/contexts/ToastContext";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useLocation } from "@/hooks/useLocation";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useEffect, useState } from "react";

export default function UsePage() {
  const [userInput, setUserInput] = useState("");
  const [hasAttemptedLocation, setHasAttemptedLocation] = useState(false);
  const [hasShownApiKeyReminder, setHasShownApiKeyReminder] = useState(false);

  // Use custom hooks
  const location = useLocation();
  const apiKeys = useApiKeys();
  const recommendations = useRecommendations();
  const { showError, showInfo, showSuccess } = useToastContext();

  // Check location permission on component load
  useEffect(() => {
    if (!hasAttemptedLocation) {
      setHasAttemptedLocation(true);
      // 簡化位置檢查邏輯
      console.log("Location check initialized");
    }
  }, [hasAttemptedLocation]);

  // 檢查 API keys 並顯示提醒
  useEffect(() => {
    if (!hasShownApiKeyReminder) {
      const validation = apiKeys.validateApiKeys();
      if (!validation.isValid) {
        showInfo(
          "請先前往設定頁面設定您的 API Keys，這樣才能使用推薦功能",
          "設定提醒",
          8000
        );
        setHasShownApiKeyReminder(true);
      }
    }
  }, [apiKeys, hasShownApiKeyReminder, showInfo]);

  const handleSubmit = async () => {
    // 直接執行搜尋邏輯
    await executeSearch();
  };

  // 新增：執行搜尋的實際邏輯
  const executeSearch = async () => {
    // 如果正在獲取位置，稍等片刻
    if (location.isGettingLocation) {
      showInfo("正在獲取您的位置，請稍候...", "位置獲取中");
      return;
    }

    // 如果沒有位置，使用預設位置（台北市中心）
    const searchLat = location.latitude || 25.033;
    const searchLng = location.longitude || 121.5654;

    if (!location.latitude || !location.longitude) {
      showInfo("使用預設位置（台北市中心）進行搜尋", "位置提示");
    }

    // Validate API Keys
    const validation = apiKeys.validateApiKeys();
    if (!validation.isValid) {
      showError(validation.error, "API Key 未設定");
      return;
    }

    const keys = apiKeys.getApiKeys();
    try {
      await recommendations.handleSubmit({
        userInput,
        latitude: searchLat,
        longitude: searchLng,
        radius: location.radius * 1000, // 轉換為米
        userGoogleApiKey: keys.google,
        userGeminiApiKey: keys.gemini,
      });
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const handleRandomPick = () => {
    recommendations.handleRandomPick();
  };

  const handleRandomRestaurants = async () => {
    // 直接執行隨機選擇邏輯，不做位置檢查
    await executeRandomPick();
  };

  // 新增：執行隨機選擇的實際邏輯
  const executeRandomPick = async () => {
    // 使用預設位置如果沒有設定位置
    const searchLat = location.latitude || 25.033;
    const searchLng = location.longitude || 121.5654;

    if (!location.latitude || !location.longitude) {
      showInfo("使用預設位置（台北市中心）進行搜尋", "位置提示");
    }

    // Validate Google API Key
    const validation = apiKeys.validateApiKeys(["google"]);
    if (!validation.isValid) {
      showError(validation.error, "API Key 未設定");
      return;
    }

    const keys = apiKeys.getApiKeys();
    try {
      await recommendations.handleRandomRestaurants({
        latitude: searchLat,
        longitude: searchLng,
        radius: location.radius * 1000, // 使用當前設定的半徑
        userGoogleApiKey: keys.google,
      });
    } catch (error) {
      console.error("Random restaurant selection failed:", error);
      showError("隨機選擇失敗，請稍後再試", "錯誤");
    }
  };

  // 檢查是否有待確認的位置更新
  const hasPendingUpdate = !!location.pendingLocationUpdate;

  return (
    <>
      <div className="min-h-screen bg-white">
        <main className="py-16">
          <Container maxWidth="6xl" className="px-4 sm:px-6">
            {/* Page Title Area */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span>開始使用</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                開始使用 <span className="text-orange-600">FoodieAI</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                告訴我們您的偏好，AI 會為您推薦最適合的餐廳
              </p>
            </div>

            {/* 背景位置距離檢查 - 無 UI，只在距離太遠時用 Toast 提醒 */}
            <LocationDistanceChecker />

            {/* Main Functionality Area */}
            <div className="mb-16">
              {/* Hidden Location Permission Handler */}
              <LocationPermission
                onLocationObtained={(lat: number, lng: number) => {
                  console.log("Location obtained in parent:", lat, lng);
                }}
              />

              <SearchInput
                value={userInput}
                onChange={setUserInput}
                onSubmit={handleSubmit}
                onRandomPick={handleRandomRestaurants}
                isLoading={recommendations.isLoading}
                isRandomLoading={recommendations.isRandomLoading}
                error={recommendations.error}
              />

              {/* Quick Suggestions Area */}
              <div className="mt-12">
                <QuickSuggestions
                  onSuggestionClick={(suggestion) => setUserInput(suggestion)}
                  isLoading={recommendations.isLoading}
                />
              </div>

              {/* Recommendation Results - Display below suggestions with proper spacing */}
              {recommendations.showResults && (
                <div className="mt-16">
                  <RecommendationResults
                    recommendations={recommendations.recommendations}
                    onRandomPick={handleRandomPick}
                    aiReason={recommendations.aiReason}
                    aiRecommendedCount={recommendations.aiRecommendedCount}
                  />
                </div>
              )}
            </div>

            {/* Features Description */}
            <div className="mb-16">
              <Features />
            </div>
          </Container>
        </main>

        <Footer />

        {/* 位置更新確認對話框 */}
        <LocationUpdateDialog
          isOpen={hasPendingUpdate}
          onClose={location.rejectLocationUpdate}
          onConfirm={() => {
            if (location.pendingLocationUpdate) {
              const { lat, lng, source } = location.pendingLocationUpdate;
              location.confirmLocationUpdate(lat, lng, source);
              showSuccess("位置已更新", "位置更新成功");
            }
          }}
          distance={location.pendingLocationUpdate?.distance || 0}
          source={location.pendingLocationUpdate?.source || "gps"}
          updateDirection={location.pendingLocationUpdate?.updateDirection}
        />
      </div>
    </>
  );
}
