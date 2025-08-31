import { recommendRestaurantsWithAI } from "@/lib/ai";
import { API_CONFIG } from "@/lib/config";
import { getPlaceDetails, searchNearbyRestaurants } from "@/lib/google";
import { RecommendationRequest, Restaurant } from "@/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * 驗證請求
 */
const validateRequest = (body: RecommendationRequest) => {
  const {
    userInput,
    latitude,
    longitude,
    radius,
    userGoogleApiKey,
    userGeminiApiKey,
  } = body;

  if (typeof userInput !== "string") {
    throw new Error("userInput must be a string");
  }

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    throw new Error("latitude and longitude are required and must be numbers");
  }

  if (typeof radius !== "number" || radius < 100 || radius > 5000) {
    throw new Error("radius must be a number between 100 and 5000");
  }

  // Check if required API Keys are provided
  if (!userGoogleApiKey || typeof userGoogleApiKey !== "string") {
    throw new Error("userGoogleApiKey is required");
  }

  if (!userGeminiApiKey || typeof userGeminiApiKey !== "string") {
    throw new Error("userGeminiApiKey is required");
  }

  return {
    userInput: userInput.trim(),
    latitude,
    longitude,
    radius,
    userGoogleApiKey,
    userGeminiApiKey,
  };
};

/**
 * 豐富餐廳資訊
 */
async function enrichRestaurants(
  restaurants: Restaurant[],
  userGoogleApiKey?: string
): Promise<Restaurant[]> {
  const enriched: Restaurant[] = [];

  for (const restaurant of restaurants) {
    if (!restaurant.placeId) {
      enriched.push(restaurant);
      continue;
    }

    try {
      const details = await getPlaceDetails({
        placeId: restaurant.placeId,
        userApiKey: userGoogleApiKey, // Pass user's Google API Key
      });
      enriched.push({ ...restaurant, ...details });
    } catch {
      enriched.push(restaurant);
    }
  }

  return enriched;
}

/**
 * 生成後備推薦說明
 */
function generateFallbackReason(
  recommendations: Restaurant[],
  userInput: string,
  radius: number
): string {
  let reason = `根據您的需求，我為您推薦了以下餐廳：\n\n`;

  recommendations.forEach((restaurant, index) => {
    reason += `${index + 1}. ${restaurant.name}\n`;
    reason += `📍 距離：${restaurant.distance.toFixed(1)}km\n`;
    if (restaurant.rating) {
      reason += `⭐ 評分：${restaurant.rating}/5\n`;
    }
    if (restaurant.cuisine) {
      reason += `🍽️ 菜系：${restaurant.cuisine}\n`;
    }
    reason += `\n`;
  });

  if (userInput.trim()) {
    reason += `推薦理由：基於您的搜尋條件「${userInput}」，在 ${(
      radius / 1000
    ).toFixed(
      1
    )}km 範圍內為您精選出這些餐廳。這些餐廳在距離、評價和實用性方面都經過綜合考量，希望能幫助您找到滿意的用餐選擇！`;
  } else {
    reason += `推薦理由：在 ${(radius / 1000).toFixed(
      1
    )}km 範圍內為您精選出這些餐廳。這些餐廳在距離、評價、實用性和多樣性方面都經過 AI 智能分析，希望能幫助您找到滿意的用餐選擇！`;
  }

  return reason;
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();

    // Validate request
    const {
      userInput,
      latitude,
      longitude,
      radius,
      userGoogleApiKey,
      userGeminiApiKey,
    } = validateRequest(body);

    // 1. Search nearby restaurants - pass user's Google API Key
    const nearby = await searchNearbyRestaurants({
      latitude,
      longitude,
      radius,
      keyword: userInput,
      openNow: true,
      userApiKey: userGoogleApiKey, // Pass user's Google API Key
      maxResults: 40, // Search up to 40 restaurants
    });

    // Check if restaurants were found
    if (nearby.length === 0) {
      // Provide more detailed diagnostic information
      const diagnosticInfo = {
        searchParams: {
          latitude,
          longitude,
          radius,
          keyword: userInput || "無",
          openNow: true,
        },
        suggestions: [
          "嘗試擴大搜尋範圍（目前為 " + (radius / 1000).toFixed(1) + "km）",
          "調整搜尋關鍵詞",
          "檢查定位是否正確",
          "確認該區域是否有餐廳營業",
        ],
      };

      console.log("No restaurants found:", diagnosticInfo);

      // Return normal response instead of error
      return NextResponse.json({
        success: true,
        data: {
          recommendations: [],
          totalFound: 0,
          userInput,
          searchRadius: radius,
          aiReason: `很抱歉，在 ${(radius / 1000).toFixed(
            1
          )}km 範圍內沒有找到任何餐廳。\n\n建議：\n• 嘗試擴大搜尋範圍\n• 調整搜尋關鍵詞\n• 檢查定位是否正確`,
          aiRecommendedCount: 0,
          noResultsFound: true, // Flag for no results found
        },
      });
    }

    // 2. Enrich restaurant information - pass user's Google API Key
    const enriched = await enrichRestaurants(nearby, userGoogleApiKey);

    // 3. Let AI perform smart sorting and quantity decision - pass user's Gemini API Key
    const gemini = await recommendRestaurantsWithAI({
      restaurants: enriched,
      userRequest: userInput,
      latitude,
      longitude,
      radius,
      userApiKey: userGeminiApiKey,
    });

    // 4. Get AI recommendation results
    let recommendations: Restaurant[];
    if (gemini?.ids?.length) {
      // Use AI sorted results
      const idToItem = new Map(enriched.map((r) => [r.id, r] as const));

      recommendations = gemini.ids
        .map((id) => idToItem.get(id))
        .filter(Boolean) as Restaurant[];

      // Limit maximum quantity (prevent AI from returning too many)
      if (recommendations.length > API_CONFIG.MAX_RECOMMENDATIONS) {
        recommendations = recommendations.slice(
          0,
          API_CONFIG.MAX_RECOMMENDATIONS
        );
      }
    } else {
      // AI failure fallback: sort by distance and take top 5
      recommendations = enriched
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
    }

    // 5. Generate recommendation description
    const finalReason =
      gemini?.message ||
      generateFallbackReason(recommendations, userInput, radius);

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        totalFound: nearby.length,
        userInput,
        searchRadius: radius,
        aiReason: finalReason,
        aiRecommendedCount: recommendations.length, // AI actual recommendation count
      },
    });
  } catch (error) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "推薦系統暫時無法使用，請稍後再試",
      },
      { status: 500 }
    );
  }
}
