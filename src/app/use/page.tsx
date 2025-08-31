"use client";

import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LocationPermission from "@/components/LocationPermission";
import QuickSuggestions from "@/components/QuickSuggestions";
import RecommendationResults from "@/components/RecommendationResults";
import RestaurantDetails from "@/components/RestaurantDetails";
import SearchInput from "@/components/SearchInput";

import Container from "@/components/ui/Container";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useLocation } from "@/hooks/useLocation";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Restaurant } from "@/types";
import { useEffect, useState } from "react";

export default function UsePage() {
  const [userInput, setUserInput] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [hasAttemptedLocation, setHasAttemptedLocation] = useState(false);

  // Use custom hooks
  const location = useLocation();
  const apiKeys = useApiKeys();
  const recommendations = useRecommendations();

  // Check location permission on component load
  useEffect(() => {
    if (!hasAttemptedLocation) {
      setHasAttemptedLocation(true);
      // Just check permission status, don't auto-request
      location.checkPermission();
    }
  }, [hasAttemptedLocation, location]);

  const handleSubmit = async () => {
    try {
      // Re-get location on each request to ensure it's current
      const loc = await location.getLocation();
      const lat = loc.lat;
      const lng = loc.lng;

      // Validate API Keys
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
        radius: 1500, // Use default radius
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
    try {
      // Re-get location on each request to ensure it's current
      const loc = await location.getLocation();

      // Validate Google API Key
      const validation = apiKeys.validateApiKeys(["google"]);
      if (!validation.isValid) {
        recommendations.setError(validation.error);
        return;
      }

      const keys = apiKeys.getApiKeys();
      await recommendations.handleRandomRestaurants({
        latitude: loc.lat,
        longitude: loc.lng,
        radius: 1500, // Use default radius
        userGoogleApiKey: keys.google,
      });
    } catch (error) {
      console.error("Random restaurant selection failed:", error);
      recommendations.setError("Location failed, please try again later");
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

              {/* Recommendation Results - Display below search box */}
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

              {/* Quick Suggestions Area */}
              <QuickSuggestions
                onSuggestionClick={(suggestion) => setUserInput(suggestion)}
                isLoading={recommendations.isLoading}
              />
            </div>

            {/* Features Description */}
            <div className="mb-16">
              <Features />
            </div>
          </Container>
        </main>

        <Footer />

        {/* Restaurant Details Modal */}
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
