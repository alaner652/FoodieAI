"use client";

import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LocationPermission from "@/components/LocationPermission";
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
  const { showError, showInfo } = useToastContext();

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
    if (!location.latitude || !location.longitude) {
      showError("請先設定位置", "位置未設定");
      return;
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
        latitude: location.latitude,
        longitude: location.longitude,
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
    if (!location.latitude || !location.longitude) {
      showError("請先設定位置", "位置未設定");
      return;
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
        latitude: location.latitude,
        longitude: location.longitude,
        radius: location.radius * 1000, // 使用當前設定的半徑
        userGoogleApiKey: keys.google,
      });
    } catch (error) {
      console.error("Random restaurant selection failed:", error);
      showError("隨機選擇失敗，請稍後再試", "錯誤");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Header showNav={true} />

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
      </div>
    </>
  );
}
