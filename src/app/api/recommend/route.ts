import { rerankWithGemini } from "@/lib/ai";
import { API_CONFIG } from "@/lib/config";
import { fetchPlaceDetails, searchNearbyRestaurants } from "@/lib/google";
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

  // 檢查是否提供了必要的 API Keys
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
      const details = await fetchPlaceDetails({
        placeId: restaurant.placeId,
        userApiKey: userGoogleApiKey, // 傳遞使用者的 Google API Key
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

    // 驗證請求
    const {
      userInput,
      latitude,
      longitude,
      radius,
      userGoogleApiKey,
      userGeminiApiKey,
    } = validateRequest(body);

    // 1. 搜尋附近餐廳 - 傳遞使用者的 Google API Key
    const nearby = await searchNearbyRestaurants({
      latitude,
      longitude,
      radius,
      keyword: userInput,
      openNow: true,
      userApiKey: userGoogleApiKey, // 傳遞使用者的 Google API Key
      maxResults: 40, // 最多搜尋 40 間餐廳
    });

    // 檢查是否找到餐廳
    if (nearby.length === 0) {
      // 提供更詳細的診斷資訊
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

      // 改為正常回應，而不是錯誤
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
          noResultsFound: true, // 標記沒有找到結果
        },
      });
    }

    // 2. 豐富餐廳資訊 - 傳遞使用者的 Google API Key
    const enriched = await enrichRestaurants(nearby, userGoogleApiKey);

    // 3. 讓 AI 進行智能排序和數量決定 - 傳遞使用者的 Gemini API Key
    const gemini = await rerankWithGemini({
      restaurants: enriched,
      userInput,
      latitude,
      longitude,
      radius, // 傳遞半徑資訊給 AI
      maxRecommendations: API_CONFIG.MAX_RECOMMENDATIONS, // 最大推薦數量
      userApiKey: userGeminiApiKey, // 傳遞使用者的 Gemini API Key
    });

    // 4. 獲取 AI 推薦結果
    let recommendations: Restaurant[];
    if (gemini?.ids?.length) {
      // 使用 AI 排序結果
      const idToItem = new Map(enriched.map((r) => [r.id, r] as const));

      recommendations = gemini.ids
        .map((id) => idToItem.get(id))
        .filter(Boolean) as Restaurant[];

      // 限制最大數量（防止 AI 回傳過多）
      if (recommendations.length > API_CONFIG.MAX_RECOMMENDATIONS) {
        recommendations = recommendations.slice(
          0,
          API_CONFIG.MAX_RECOMMENDATIONS
        );
      }
    } else {
      // AI 失敗時的後備方案：按距離排序取前 5 間
      recommendations = enriched
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
    }

    // 5. 生成推薦說明
    const finalReason =
      gemini?.reason ||
      generateFallbackReason(recommendations, userInput, radius);

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        totalFound: nearby.length,
        userInput,
        searchRadius: radius,
        aiReason: finalReason,
        aiRecommendedCount: recommendations.length, // 新增：AI 實際推薦數量
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
