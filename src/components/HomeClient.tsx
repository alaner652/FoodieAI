"use client";

import RecommendationResults from "@/components/RecommendationResults";
import RestaurantDetails from "@/components/RestaurantDetails";
import SearchInput from "@/components/SearchInput";
import { API_CONFIG, DEV_CONFIG, MAP_CONFIG, UI_CONFIG } from "@/lib/config";
import { Restaurant } from "@/types";
import { Check, Compass, Globe, Navigation, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function HomeClient() {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [aiReason, setAiReason] = useState<string>("");
  const [aiRecommendedCount, setAiRecommendedCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(API_CONFIG.DEFAULT_RADIUS);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // 移除預設位置，改為自動獲取使用者位置
  // const DEFAULT_LATITUDE = 25.033;
  // const DEFAULT_LONGITUDE = 121.5654;

  // 組件載入時自動獲取使用者位置
  useEffect(() => {
    const getInitialLocation = async () => {
      try {
        // 嘗試獲取使用者位置
        const loc = await getLocation();
        setLatitude(loc.lat);
        setLongitude(loc.lng);
      } catch (error) {
        console.log("無法獲取使用者位置，將使用預設位置");
        // 如果無法獲取位置，使用台北市中心作為後備
        setLatitude(25.033);
        setLongitude(121.5654);
      }
    };

    // 只在組件首次載入時執行
    getInitialLocation();
  }, []); // 空依賴陣列，只在組件載入時執行一次

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => reject(err),
        {
          enableHighAccuracy: MAP_CONFIG.GEOLOCATION.ENABLE_HIGH_ACCURACY,
          timeout: MAP_CONFIG.GEOLOCATION.TIMEOUT,
        }
      );
    });
  };

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    setError("");

    try {
      const loc = await getLocation();
      setLatitude(loc.lat);
      setLongitude(loc.lng);
    } catch (error) {
      console.error("取得位置失敗:", error);
      setError(UI_CONFIG.ERROR_MESSAGES.LOCATION_FAILED);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setShowResults(false);
    setError("");

    try {
      let lat = latitude;
      let lng = longitude;
      if (lat == null || lng == null) {
        const loc = await getLocation();
        lat = loc.lat;
        lng = loc.lng;
        setLatitude(lat);
        setLongitude(lng);
      }

      // 從 localStorage 讀取使用者的 API Keys
      const userGoogleApiKey = localStorage.getItem("userGoogleApiKey") || "";
      const userGeminiApiKey = localStorage.getItem("userGeminiKey") || "";

      // 檢查是否設定了必要的 API Keys
      if (!userGoogleApiKey.trim()) {
        setError("請先設定您的 Google Places API Key，前往測試頁面進行設定。");
        setIsLoading(false);
        return;
      }

      if (!userGeminiApiKey.trim()) {
        setError("請先設定您的 Gemini API Key，前往測試頁面進行設定。");
        setIsLoading(false);
        return;
      }

      // 修改：在 API 請求中包含使用者的 API Keys
      const response = await fetch(DEV_CONFIG.ENDPOINTS.RECOMMEND, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: userInput.trim() || "", // 如果為空則傳送空字串
          latitude: lat,
          longitude: lng,
          radius,
          userGoogleApiKey: userGoogleApiKey, // 傳遞使用者的 Google API Key
          userGeminiApiKey: userGeminiApiKey, // 傳遞使用者的 Gemini API Key
        }),
      });

      const result = await response.json();

      if (result.success) {
        setRecommendations(result.data.recommendations);
        setAiReason(result.data.aiReason || "");
        setAiRecommendedCount(result.data.aiRecommendedCount || 0);
        setShowResults(true);

        if (result.data.noResultsFound) {
          setError("");
        }
      } else {
        let errorMessage = result.error;

        // 改進錯誤訊息處理
        if (errorMessage.includes("API")) {
          errorMessage = "推薦系統暫時無法使用，請稍後再試";
        } else if (errorMessage.includes("userInput")) {
          errorMessage = "搜尋條件格式錯誤，請重新輸入";
        } else if (
          errorMessage.includes("latitude") ||
          errorMessage.includes("longitude")
        ) {
          errorMessage = "位置資訊錯誤，請重新定位";
        } else if (errorMessage.includes("radius")) {
          errorMessage = "搜尋範圍設定錯誤，請調整範圍";
        }

        setError(errorMessage);
        console.error("推薦失敗:", result.error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : UI_CONFIG.ERROR_MESSAGES.API_FAILED;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomPick = useCallback(() => {
    if (recommendations.length === 0) return;
    const shuffled = [...recommendations].sort(() => Math.random() - 0.5);
    const selected = shuffled[0];
    setRecommendations([selected]);
  }, [recommendations]);

  const handleViewDetails = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedRestaurant(null);
  }, []);

  return (
    <>
      <SearchInput
        value={userInput}
        onChange={setUserInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />

      {/* 重新設計的地圖設定區域 */}
      <div className="mt-6">
        {/* 位置設定卡片 */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-2 md:p-1.5 shadow-md">
          {/* 標題區域 */}
          <div className="text-center mb-3 md:mb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 md:w-8 md:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-sm mb-2 md:mb-1">
              <Globe className="w-5 h-5 md:w-4 md:h-4 text-white" />
            </div>
            <h3 className="text-lg md:text-base font-bold text-gray-900 mb-1">
              📍 位置設定
            </h3>
            <p className="text-xs text-gray-600">
              設定您的搜尋位置和範圍，找到最適合的餐廳
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* 左側：位置資訊 */}
            <div className="space-y-2 md:space-y-1.5">
              <div className="bg-white rounded-lg p-4 md:p-3.5 border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="flex items-center space-x-2 mb-3 md:mb-2.5">
                  <div className="w-6 h-6 md:w-5 md:h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center shadow-sm">
                    <Compass className="w-3 h-3 md:w-2.5 md:h-2.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-xs font-semibold text-gray-800">
                      目前位置
                    </h4>
                    <p className="text-xs text-gray-500">
                      使用 GPS 定位您的當前位置
                    </p>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-2.5 flex-1">
                  <button
                    onClick={handleGetLocation}
                    disabled={isGettingLocation || isLoading}
                    className="group w-full flex items-center justify-center space-x-2 px-3 py-2.5 md:px-2.5 md:py-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none"
                  >
                    {isGettingLocation ? (
                      <>
                        <div className="w-3 h-3 md:w-2.5 md:h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium text-xs">定位中...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3 h-3 md:w-2.5 md:h-2.5" />
                        <span className="font-medium text-xs">
                          📍 取得目前位置
                        </span>
                      </>
                    )}
                  </button>

                  {latitude != null && longitude != null && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-md border-2 border-green-200 p-3 md:p-2.5 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 md:w-4 md:h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                          <Check className="w-2.5 h-2.5 md:w-2 md:h-2 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-sm p-2 md:p-1.5 border border-green-200">
                            <p className="text-xs text-green-700 font-medium mb-1">
                              座標位置
                            </p>
                            <p className="text-xs font-mono text-green-800">
                              {latitude.toFixed(6)}, {longitude.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右側：搜尋範圍設定 */}
            <div className="space-y-2 md:space-y-1.5">
              <div className="bg-white rounded-lg p-4 md:p-3.5 border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="flex items-center space-x-2 mb-3 md:mb-2.5">
                  <div className="w-6 h-6 md:w-5 md:h-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md flex items-center justify-center shadow-sm">
                    <Zap className="w-3 h-3 md:w-2.5 md:h-2.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-xs font-semibold text-gray-800">
                      搜尋範圍
                    </h4>
                    <p className="text-xs text-gray-500">
                      設定搜尋餐廳的地理範圍
                    </p>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-2.5 flex-1">
                  {/* 自定義半徑輸入 */}
                  <div className="space-y-2 md:space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        className="flex-1 rounded-md border-2 border-gray-200 px-2 py-2 md:px-1.5 md:py-1.5 text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all duration-200 shadow-sm"
                        value={radius}
                        min={API_CONFIG.MIN_RADIUS}
                        max={API_CONFIG.MAX_RADIUS}
                        step={100}
                        onChange={(e) => setRadius(Number(e.target.value))}
                      />
                    </div>

                    {/* 範圍指示器 */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-md p-3 md:p-2.5 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-700 font-medium">
                          搜尋範圍
                        </span>
                        <span className="text-sm md:text-xs font-bold text-purple-800">
                          {(radius / 1000).toFixed(1)} 公里
                        </span>
                      </div>
                      <div className="mt-1.5 md:mt-1 w-full bg-purple-200 rounded-full h-1">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              ((radius - API_CONFIG.MIN_RADIUS) /
                                (API_CONFIG.MAX_RADIUS -
                                  API_CONFIG.MIN_RADIUS)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-purple-600 md:mt-1.5">
                        <span>{API_CONFIG.MIN_RADIUS / 1000}km</span>
                        <span>{API_CONFIG.MAX_RADIUS / 1000}km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="mt-3 md:mt-2 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-2 py-1 md:px-1.5 md:py-0.5 rounded-full text-xs">
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
              <span>設定完成後，在搜尋框輸入需求即可開始搜尋</span>
            </div>
          </div>
        </div>
      </div>

      {/* 餐廳詳情彈窗 */}
      {selectedRestaurant && (
        <RestaurantDetails
          restaurant={selectedRestaurant}
          onClose={handleCloseDetails}
        />
      )}

      {showResults && (
        <div className="mt-8">
          <RecommendationResults
            recommendations={recommendations}
            onRandomPick={handleRandomPick}
            onViewDetails={handleViewDetails}
            aiReason={aiReason}
            aiRecommendedCount={aiRecommendedCount}
          />
        </div>
      )}
    </>
  );
}
