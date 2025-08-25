"use client";

import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RecommendationResults from "@/components/RecommendationResults";
import RestaurantDetails from "@/components/RestaurantDetails";
import SearchInput from "@/components/SearchInput";
import { Restaurant } from "@/types";
import { useState } from "react";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [aiReason, setAiReason] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(1500);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setShowResults(false);

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

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: userInput.trim(),
          latitude: lat,
          longitude: lng,
          radius,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setRecommendations(result.data.recommendations);
        setAiReason(result.data.aiReason || "");
        setShowResults(true);
      } else {
        console.error("推薦失敗:", result.error);
      }
    } catch (error) {
      console.error("API 調用失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomPick = () => {
    if (recommendations.length === 0) return;
    const shuffled = [...recommendations].sort(() => Math.random() - 0.5);
    const selected = shuffled[0];
    setRecommendations([selected]);
  };

  const handleViewDetails = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleCloseDetails = () => {
    setSelectedRestaurant(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Hero />

        <SearchInput
          value={userInput}
          onChange={setUserInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <div className="mt-4 border border-gray-200 rounded-lg p-3 bg-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
                onClick={async () => {
                  try {
                    const loc = await getLocation();
                    setLatitude(loc.lat);
                    setLongitude(loc.lng);
                  } catch {}
                }}
              >
                取得定位
              </button>
              {latitude != null && longitude != null && (
                <span className="text-gray-600">
                  已定位：{latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label className="flex items-center gap-2">
                搜尋半徑
                <input
                  type="number"
                  className="w-28 rounded border border-gray-300 px-2 py-1"
                  value={radius}
                  min={200}
                  max={5000}
                  step={100}
                  onChange={(e) => setRadius(Number(e.target.value))}
                />
                <span className="text-gray-500">
                  公尺（約 {(radius / 1000).toFixed(1)} km）
                </span>
              </label>
              <div className="flex items-center gap-2">
                {[500, 1000, 2000, 3000].map((r) => (
                  <button
                    key={r}
                    className={`px-2.5 py-1 rounded border text-xs ${
                      radius === r
                        ? "border-blue-600 text-blue-700 bg-blue-50"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setRadius(r)}
                  >
                    {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showResults && (
          <div className="mt-8">
            <RecommendationResults
              recommendations={recommendations}
              onRandomPick={handleRandomPick}
              onViewDetails={handleViewDetails}
              aiReason={aiReason}
            />
          </div>
        )}

        {!showResults && <Features />}
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
  );
}
