"use client";

import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import QuickSuggestions from "@/components/QuickSuggestions";
import RecommendationResults from "@/components/RecommendationResults";
import RestaurantDetails from "@/components/RestaurantDetails";
import SearchInput from "@/components/SearchInput";
import Alert from "@/components/ui/Alert";
import Container from "@/components/ui/Container";
import { useApiKeys, useLocation, useRecommendations } from "@/hooks";
import { Restaurant } from "@/types";
import { useEffect, useState } from "react";

export default function UsePage() {
  const [userInput, setUserInput] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  // 使用自定義 Hooks
  const location = useLocation();
  const apiKeys = useApiKeys();
  const recommendations = useRecommendations();

  // 組件載入時自動獲取位置
  useEffect(() => {
    const autoGetLocation = async () => {
      try {
        await location.handleGetLocation();
        location.startLocationWatch();
      } catch (error) {
        console.error("自動位置獲取失敗:", error);
      }
    };

    // 如果沒有位置，自動獲取
    if (!location.latitude || !location.longitude) {
      autoGetLocation();
    }
  }, [location]);

  const handleSubmit = async () => {
    try {
      // 每次發送請求時都重新獲取位置，確保位置是最新的
      const loc = await location.getLocation();
      const lat = loc.lat;
      const lng = loc.lng;

      // 驗證 API Keys
      const validation = apiKeys.validateApiKeys();
      if (!validation.isValid) {
        recommendations.setError(validation.error);
        return;
      }

      const keys = apiKeys.getApiKeys();
      await recommendations.handleSubmit({
        userInput,
        latitude: lat,
        longitude: lng,
        radius: 1500, // 使用預設半徑
        userGoogleApiKey: keys.google,
        userGeminiApiKey: keys.gemini,
      });
    } catch (error) {
      console.error("提交失敗:", error);
    }
  };

  const handleRandomPick = () => {
    recommendations.handleRandomPick();
  };

  const handleRandomRestaurants = async () => {
    try {
      // 每次發送請求時都重新獲取位置，確保位置是最新的
      const loc = await location.getLocation();

      // 驗證 Google API Key
      const validation = apiKeys.validateApiKeys(["google"]);
      if (!validation.isValid) {
        recommendations.setError(validation.error);
        return;
      }

      const keys = apiKeys.getApiKeys();
      await recommendations.handleRandomRestaurants({
        latitude: loc.lat,
        longitude: loc.lng,
        radius: 1500, // 使用預設半徑
        userGoogleApiKey: keys.google,
      });
    } catch (error) {
      console.error("隨機餐廳選擇失敗:", error);
      recommendations.setError("位置獲取失敗，請稍後再試");
    }
  };

  const handleCloseDetails = () => {
    setSelectedRestaurant(null);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Header showNav={true} />

        <main className="py-16">
          <Container maxWidth="6xl" className="px-4">
            {/* 頁面標題區域 */}
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

            {/* 主要功能區域 */}
            <div className="mb-16">
              <SearchInput
                value={userInput}
                onChange={setUserInput}
                onSubmit={handleSubmit}
                onRandomPick={handleRandomRestaurants}
                isLoading={recommendations.isLoading}
                isRandomLoading={recommendations.isRandomLoading}
                error={recommendations.error}
              />

              {/* 推薦結果 - 顯示在搜尋框正下方 */}
              {recommendations.showResults && (
                <div className="mt-8">
                  <RecommendationResults
                    recommendations={recommendations.recommendations}
                    onRandomPick={handleRandomPick}
                    aiReason={recommendations.aiReason}
                    aiRecommendedCount={recommendations.aiRecommendedCount}
                  />
                </div>
              )}

              {/* 錯誤和成功訊息顯示 */}
              {recommendations.error && (
                <div className="mt-6">
                  <Alert
                    variant="error"
                    title="操作失敗"
                    onClose={() => recommendations.clearError()}
                  >
                    {recommendations.error}
                  </Alert>
                </div>
              )}

              {location.error && (
                <div className="mt-6">
                  <Alert
                    variant="warning"
                    title="位置問題"
                    onClose={() => location.clearError()}
                  >
                    {location.error}
                  </Alert>
                </div>
              )}

              {/* 快速建議區域 */}
              <QuickSuggestions
                onSuggestionClick={(suggestion) => setUserInput(suggestion)}
                isLoading={recommendations.isLoading}
              />
            </div>

            {/* 特色說明 */}
            <div className="mb-16">
              <Features />
            </div>
          </Container>
        </main>

        <Footer />

        {/* 餐廳詳情彈窗 */}
        {selectedRestaurant && (
          <RestaurantDetails
            restaurant={selectedRestaurant}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </>
  );
}
