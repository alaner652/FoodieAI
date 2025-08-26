import { rerankWithGemini } from "@/lib/ai";
import { fetchPlaceDetails, searchNearbyRestaurants } from "@/lib/google";
import { RecommendationRequest, Restaurant } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// API 配置常量
const API_CONFIG = {
  DEFAULT_RADIUS: 1500, // 1.5km
  MAX_RECOMMENDATIONS: 4, // 最大推薦數量（改為 4 間）
} as const;

/**
 * 驗證請求參數
 */
function validateRequest(body: RecommendationRequest): {
  isValid: boolean;
  error?: string;
  data?: {
    userInput: string;
    latitude: number;
    longitude: number;
    radius: number;
  };
} {
  const userInput = (body.userInput || "").trim();
  const latitude =
    typeof body.latitude === "number" ? body.latitude : undefined;
  const longitude =
    typeof body.longitude === "number" ? body.longitude : undefined;
  const radius =
    typeof body.radius === "number" ? body.radius : API_CONFIG.DEFAULT_RADIUS;

  if (!latitude || !longitude) {
    return { isValid: false, error: "缺少使用者座標" };
  }

  return {
    isValid: true,
    data: { userInput, latitude, longitude, radius },
  };
}

/**
 * 豐富餐廳資訊
 */
async function enrichRestaurants(
  restaurants: Restaurant[]
): Promise<Restaurant[]> {
  const enriched: Restaurant[] = [];

  for (const restaurant of restaurants) {
    if (!restaurant.placeId) {
      enriched.push(restaurant);
      continue;
    }

    try {
      const details = await fetchPlaceDetails({ placeId: restaurant.placeId });
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

    // 驗證請求參數
    const validation = validateRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { userInput, latitude, longitude, radius } = validation.data!;

    // 1. 搜尋附近餐廳
    const nearby = await searchNearbyRestaurants({
      latitude,
      longitude,
      radius,
      keyword: userInput,
      openNow: true,
    });

    // 檢查是否找到餐廳
    if (nearby.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `在 ${(radius / 1000).toFixed(
            1
          )}km 範圍內沒有找到任何餐廳，請嘗試擴大搜尋範圍或調整關鍵詞`,
        },
        { status: 404 }
      );
    }

    // 2. 豐富餐廳資訊
    const enriched = await enrichRestaurants(nearby);

    // 3. 讓 AI 進行智能排序和數量決定
    const gemini = await rerankWithGemini({
      restaurants: enriched,
      userInput,
      latitude,
      longitude,
      radius, // 傳遞半徑資訊給 AI
      maxRecommendations: API_CONFIG.MAX_RECOMMENDATIONS, // 最大推薦數量
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
