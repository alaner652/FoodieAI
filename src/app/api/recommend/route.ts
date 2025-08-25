import { rerankWithGemini } from "@/lib/ai";
import { fetchPlaceDetails, searchNearbyRestaurants } from "@/lib/google";
import { RecommendationRequest, Restaurant } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// 評分權重常量
const SCORE_WEIGHTS = {
  DISTANCE: 0.5,
  RATING: 0.25,
  MATCH: 0.2,
  PRACTICAL: 0.05,
} as const;

// 評分參數常量
const SCORE_PARAMS = {
  DISTANCE_MULTIPLIER: 15,
  RATING_MULTIPLIER: 20,
  DEFAULT_RATING: 3.0,
  BASE_ENCOURAGEMENT_SCORE: 60,
  MIN_MATCH_SCORE: 20,
  MAX_SCORE: 100,
} as const;

// 獎勵分數常量
const BONUS_SCORES = {
  OPEN_NOW: 30,
  WEBSITE: 15,
  PHOTO: 10,
  REVIEWS: 15,
  REASONABLE_PRICE: 10,
  BASE_BONUS: 20,
} as const;

// 匹配分數常量
const MATCH_SCORES = {
  NAME: 35,
  ADDRESS: 25,
  CUISINE: 30,
  SPECIALTIES: 25,
  POPULAR_DISHES: 20,
  REVIEWS: 15,
} as const;

// 餐廳名稱匹配模式
const RESTAURANT_NAME_PATTERNS = [
  /『([^』]+)』/g, // 中文引號
  /'([^']+)'/g, // 單引號
  /"([^"]+)"/g, // 雙引號
  /（([^）]+)）/g, // 中文括號
  /\(([^)]+)\)/g, // 英文括號
] as const;

// Markdown 清理模式
const MARKDOWN_PATTERNS = [
  { pattern: /\*\*(.*?)\*\*/g, replacement: "$1" }, // 粗體
  { pattern: /\*(.*?)\*/g, replacement: "$1" }, // 斜體
  { pattern: /`(.*?)`/g, replacement: "$1" }, // 代碼
  { pattern: /^#{1,6}\s+/gm, replacement: "" }, // 標題
  { pattern: /\[([^\]]+)\]\([^)]+\)/g, replacement: "$1" }, // 連結
  { pattern: /^[-*+]\s+/gm, replacement: "• " }, // 列表
  { pattern: /^\d+\.\s+/gm, replacement: "" }, // 數字列表
  { pattern: /^[-*_]{3,}$/gm, replacement: "" }, // 水平線
  { pattern: /^>\s+/gm, replacement: "" }, // 引用
] as const;

/**
 * 實用餐廳評分系統
 * 重點是解決問題，不是製造焦慮
 */
function calculateRestaurantScore(
  restaurant: Restaurant,
  userInput: string
): number {
  const distanceScore = calculateDistanceScore(restaurant.distance);
  const ratingScore = calculateRatingScore(restaurant.rating);
  const matchScore = calculateMatchScore(restaurant, userInput);
  const practicalBonus = calculatePracticalBonus(restaurant);

  return (
    distanceScore * SCORE_WEIGHTS.DISTANCE +
    ratingScore * SCORE_WEIGHTS.RATING +
    matchScore * SCORE_WEIGHTS.MATCH +
    practicalBonus * SCORE_WEIGHTS.PRACTICAL
  );
}

/**
 * 計算距離評分
 */
function calculateDistanceScore(distance: number): number {
  return Math.max(
    0,
    SCORE_PARAMS.MAX_SCORE - distance * SCORE_PARAMS.DISTANCE_MULTIPLIER
  );
}

/**
 * 計算評分品質
 */
function calculateRatingScore(rating?: number): number {
  return (
    (rating || SCORE_PARAMS.DEFAULT_RATING) * SCORE_PARAMS.RATING_MULTIPLIER
  );
}

/**
 * 計算需求匹配度（寬鬆版）
 */
function calculateMatchScore(
  restaurant: Restaurant,
  userInput: string
): number {
  if (!userInput.trim()) return SCORE_PARAMS.BASE_ENCOURAGEMENT_SCORE; // 無輸入時給較高分數，鼓勵嘗試

  const input = userInput.toLowerCase();
  let score = 0;

  // 餐廳名稱匹配（寬鬆）
  if (restaurant.name.toLowerCase().includes(input)) {
    score += MATCH_SCORES.NAME;
  }

  // 地址匹配（寬鬆）
  if (restaurant.address.toLowerCase().includes(input)) {
    score += MATCH_SCORES.ADDRESS;
  }

  // 菜系匹配（寬鬆）
  if (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(input)) {
    score += MATCH_SCORES.CUISINE;
  }

  // 特色菜餚匹配（寬鬆）
  if (restaurant.menu?.specialties) {
    const specialtyMatch = restaurant.menu.specialties.some((specialty) =>
      specialty.toLowerCase().includes(input)
    );
    if (specialtyMatch) score += MATCH_SCORES.SPECIALTIES;
  }

  // 熱門菜餚匹配（寬鬆）
  if (restaurant.menu?.popularDishes) {
    const popularMatch = restaurant.menu.popularDishes.some((dish) =>
      dish.toLowerCase().includes(input)
    );
    if (popularMatch) score += MATCH_SCORES.POPULAR_DISHES;
  }

  // 評論內容匹配（寬鬆）
  if (restaurant.reviews) {
    const reviewMatch = restaurant.reviews.some((review) =>
      review.text?.toLowerCase().includes(input)
    );
    if (reviewMatch) score += MATCH_SCORES.REVIEWS;
  }

  // 即使沒有完全匹配，也給基礎分數鼓勵嘗試
  if (score === 0) {
    score = SCORE_PARAMS.MIN_MATCH_SCORE; // 基礎鼓勵分數
  }

  return Math.min(SCORE_PARAMS.MAX_SCORE, score);
}

/**
 * 計算實用獎勵分數
 */
function calculatePracticalBonus(restaurant: Restaurant): number {
  let bonus = 0;

  // 營業中獎勵（最重要）
  if (restaurant.openNow) bonus += BONUS_SCORES.OPEN_NOW;

  // 有網站資訊獎勵（實用性）
  if (restaurant.website) bonus += BONUS_SCORES.WEBSITE;

  // 有照片獎勵（視覺參考）
  if (restaurant.photoUrl) bonus += BONUS_SCORES.PHOTO;

  // 有評論獎勵（參考價值）
  if (restaurant.reviews && restaurant.reviews.length > 0) {
    bonus += BONUS_SCORES.REVIEWS;
  }

  // 價格合理獎勵（實用性）
  if (restaurant.priceRange && restaurant.priceRange !== "$$$$") {
    bonus += BONUS_SCORES.REASONABLE_PRICE;
  }

  // 基礎獎勵（鼓勵嘗試）
  bonus += BONUS_SCORES.BASE_BONUS;

  return Math.min(SCORE_PARAMS.MAX_SCORE, bonus);
}

/**
 * 確保 AI 回應中提到的餐廳與實際推薦一致
 */
function ensureConsistency(
  aiReason: string,
  recommendations: Restaurant[]
): string {
  const actualRestaurants = recommendations.map((r) => r.name);
  const mentionedRestaurants = extractMentionedRestaurants(aiReason);
  const missingRestaurants = findMissingRestaurants(
    mentionedRestaurants,
    actualRestaurants
  );

  if (missingRestaurants.length > 0) {
    console.log("AI 回應中提到但實際未推薦的餐廳:", missingRestaurants);
    return generateCorrectedReason(recommendations);
  }

  return cleanMarkdownFormat(aiReason);
}

/**
 * 清理文字中的 markdown 格式
 */
function cleanMarkdownFormat(text: string): string {
  let cleanedText = text;

  MARKDOWN_PATTERNS.forEach(({ pattern, replacement }) => {
    cleanedText = cleanedText.replace(pattern, replacement);
  });

  // 清理多餘的空行和空白
  return cleanedText.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
}

/**
 * 從 AI 回應中提取提到的餐廳名稱
 */
function extractMentionedRestaurants(text: string): string[] {
  const restaurants: string[] = [];

  RESTAURANT_NAME_PATTERNS.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const name = match.replace(/[『』'""（）()]/g, "").trim();
        if (name && name.length > 1) {
          restaurants.push(name);
        }
      });
    }
  });

  return restaurants;
}

/**
 * 查找不匹配的餐廳
 */
function findMissingRestaurants(
  mentioned: string[],
  actual: string[]
): string[] {
  return mentioned.filter(
    (mentioned) =>
      !actual.some(
        (actual) =>
          actual.toLowerCase().includes(mentioned.toLowerCase()) ||
          mentioned.toLowerCase().includes(actual.toLowerCase())
      )
  );
}

/**
 * 生成修正後的推薦說明
 */
function generateCorrectedReason(recommendations: Restaurant[]): string {
  let reason = `根據您的需求，我為您推薦了以下餐廳：\n\n`;

  recommendations.forEach((restaurant, index) => {
    reason += formatRestaurantInfo(restaurant, index + 1);
  });

  reason += `推薦理由：這些餐廳在距離、評價和實用性方面都經過綜合考量，希望能幫助您找到滿意的用餐選擇！`;

  return reason;
}

/**
 * 生成後備推薦說明
 */
function generateFallbackReason(
  recommendations: Restaurant[],
  userInput: string,
  totalFound: number
): string {
  let reason = `根據您的需求，我為您推薦了以下餐廳：\n\n`;

  recommendations.forEach((restaurant, index) => {
    reason += formatRestaurantInfo(restaurant, index + 1);
  });

  if (userInput.trim()) {
    reason += `推薦理由：基於您的搜尋條件「${userInput}」，從附近 ${totalFound} 家餐廳中精選出這些選項。這些餐廳在距離、評價和實用性方面都經過綜合考量，希望能幫助您找到滿意的用餐選擇！`;
  } else {
    reason += `推薦理由：從附近 ${totalFound} 家餐廳中精選出這些選項。這些餐廳在距離、評價和實用性方面都經過綜合考量，希望能幫助您找到滿意的用餐選擇！`;
  }

  return reason;
}

/**
 * 格式化餐廳資訊
 */
function formatRestaurantInfo(restaurant: Restaurant, index: number): string {
  let info = `${index}. ${restaurant.name}\n`;
  info += `📍 距離：${restaurant.distance.toFixed(1)}km\n`;

  if (restaurant.rating) {
    info += `⭐ 評分：${restaurant.rating}/5 (${
      restaurant.userRatingsTotal || 0
    } 則評論)\n`;
  }
  if (restaurant.priceRange) {
    info += `💰 價格：${restaurant.priceRange}\n`;
  }
  if (restaurant.cuisine) {
    info += `🍽️ 菜系：${restaurant.cuisine}\n`;
  }

  return info + `\n`;
}

// API 配置常量
const API_CONFIG = {
  DEFAULT_RADIUS: 1500, // 1.5km
  TOP_CANDIDATES: 8,
  FINAL_RECOMMENDATIONS: 3,
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
 * 篩選候選餐廳
 */
function filterCandidates(
  nearby: Restaurant[],
  userInput: string
): Restaurant[] {
  // 優先使用有照片的餐廳
  const withPhoto = nearby.filter((r) => Boolean(r.photoUrl));
  const candidates = withPhoto.length > 0 ? withPhoto : nearby;

  // 如果有用戶輸入，進行關鍵詞篩選
  if (!userInput) return candidates;

  const keyword = userInput.toLowerCase();
  const filtered = candidates.filter(
    (r) =>
      r.name.toLowerCase().includes(keyword) ||
      r.address.toLowerCase().includes(keyword)
  );

  // 如果篩選結果為空，回退到原始候選
  return filtered.length > 0 ? filtered : candidates;
}

/**
 * 獲取頂部候選餐廳
 */
function getTopCandidates(filtered: Restaurant[]): Restaurant[] {
  return filtered
    .slice()
    .sort((a, b) => a.distance - b.distance)
    .slice(0, API_CONFIG.TOP_CANDIDATES);
}

/**
 * 豐富餐廳資訊
 */
async function enrichRestaurants(baseTop: Restaurant[]): Promise<Restaurant[]> {
  const enriched: Restaurant[] = [];

  for (const restaurant of baseTop) {
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
 * 排序並選擇最終推薦
 */
function getFinalRecommendations(
  enriched: Restaurant[],
  userInput: string,
  geminiResult?: { ids: string[]; reason?: string }
): Restaurant[] {
  let top = enriched;

  if (geminiResult?.ids?.length) {
    // 使用 AI 排序結果
    const idToItem = new Map(top.map((r) => [r.id, r] as const));
    const reordered: Restaurant[] = [];

    for (const id of geminiResult.ids) {
      const item = idToItem.get(id);
      if (item) reordered.push(item);
    }

    // 加入未被 AI 列出的項目
    for (const r of top) {
      if (!reordered.includes(r)) reordered.push(r);
    }

    top = reordered;
  } else {
    // 使用智能後備排序
    top = enriched
      .slice()
      .sort((a, b) => {
        const scoreA = calculateRestaurantScore(a, userInput);
        const scoreB = calculateRestaurantScore(b, userInput);
        return scoreB - scoreA;
      })
      .slice(0, API_CONFIG.TOP_CANDIDATES);
  }

  return top.slice(0, API_CONFIG.FINAL_RECOMMENDATIONS);
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

    // 搜尋附近餐廳
    const nearby = await searchNearbyRestaurants({
      latitude,
      longitude,
      radius,
      keyword: userInput,
      openNow: true,
    });

    // 篩選候選餐廳
    const candidates = filterCandidates(nearby, userInput);

    // 獲取頂部候選
    const baseTop = getTopCandidates(candidates);

    // 豐富餐廳資訊
    const enriched = await enrichRestaurants(baseTop);

    // 嘗試 AI 排序
    const gemini = await rerankWithGemini({
      restaurants: enriched,
      userInput,
      latitude,
      longitude,
      topK: API_CONFIG.TOP_CANDIDATES,
    });

    // 獲取最終推薦
    const recommendations = getFinalRecommendations(
      enriched,
      userInput,
      gemini || undefined
    );

    // 生成推薦說明
    const finalReason = gemini?.reason
      ? ensureConsistency(gemini.reason, recommendations)
      : generateFallbackReason(recommendations, userInput, candidates.length);

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        totalFound: candidates.length,
        userInput,
        searchRadius: radius,
        aiReason: finalReason,
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
