import { Restaurant } from "@/types";
import { AI_CONFIG } from "@/lib/config";

type GeminiModel = "gemini-1.5-flash" | "gemini-1.5-pro";

interface RerankParams {
  restaurants: Restaurant[];
  userInput: string;
  latitude: number;
  longitude: number;
  radius: number; // 新增：搜尋半徑
  maxRecommendations?: number; // 新增：最大推薦數量
  model?: GeminiModel;
}

function buildPrompt(
  restaurants: Restaurant[],
  userInput: string,
  radius: number,
  maxRecommendations: number,
  latitude: number,
  longitude: number
) {
  const guidance = `你是一個貼心的美食顧問，目標是幫助使用者找到最適合的餐廳。

**搜尋範圍資訊：**
- 使用者位置：${latitude.toFixed(4)}, ${longitude.toFixed(4)}
- 搜尋半徑：${(radius / 1000).toFixed(1)}km
- 推薦數量：${maxRecommendations} 間餐廳

**核心原則：**
1. **固定推薦數量**：始終推薦 ${maxRecommendations} 間餐廳
2. **永遠給出推薦**：從現有選項中挑選最適合的
3. **誠實說明理由**：清楚解釋為什麼選擇這些餐廳
4. **實用導向**：重點是解決問題

**排序原則：**
1. **需求匹配度**：最符合使用者需求的餐廳優先
2. **距離考量**：在需求相近的情況下，距離近的優先
3. **評分品質**：有良好評分的餐廳更可靠
4. **搜尋範圍適應**：根據半徑大小調整距離權重

**回傳格式：**
{
  "ids": ["restaurant_id_1", "restaurant_id_2", ...],
  "userMessage": "給使用者的簡單口語化說明，包含：
    - 搜尋範圍說明
    - 推薦數量說明
    - 整體推薦策略
    - 實用建議
    - 鼓勵性的結語"
}

**重要提醒：**
- 始終推薦 ${maxRecommendations} 間餐廳
- 絕對不要因為條件嚴格就放棄推薦
- 必須從現有選項中選擇最適合的
- 只回傳 JSON 格式，不要其他文字
- 只能推薦提供的餐廳列表中的餐廳
- userMessage 必須是簡單直接的口語化表達
- userMessage 絕對不能包含任何技術細節（如 ID、API 參數等）
- userMessage 不能使用任何 markdown 格式（如粗體、斜體、代碼等）
- userMessage 要像朋友聊天一樣自然`;

  const items = restaurants.map((r) => ({
    id: r.id, // 包含餐廳 ID
    name: r.name,
    address: r.address,
    rating: r.rating,
    distanceKm: r.distance,
    cuisine: r.cuisine,
    priceRange: r.priceRange,
    userRatingsTotal: r.userRatingsTotal,
    website: r.website,
    reviewSnippets: (r.reviews || [])
      .map((rev) => rev?.text)
      .filter(Boolean)
      .slice(0, 3),
    openNow: r.openNow,
  }));

  return `${guidance}

**使用者需求：** ${userInput || "(未指定特殊需求，請根據一般用餐需求進行推薦)"}

**搜尋範圍：** ${(radius / 1000).toFixed(1)}km 內，共找到 ${
    restaurants.length
  } 間餐廳

**候選餐廳資料：**
${JSON.stringify(items, null, 2)}

請從候選餐廳中選擇 ${maxRecommendations} 間最適合的餐廳並提供排序結果。只回傳 JSON 格式，不要其他文字。`;
}

export async function rerankWithGemini(
  params: RerankParams
): Promise<{ ids: string[]; reason?: string } | null> {
  const {
    restaurants,
    userInput,
    latitude,
    longitude,
    radius,
    maxRecommendations = AI_CONFIG.PROMPT.MAX_RESTAURANTS,
    model = AI_CONFIG.GEMINI.DEFAULT_MODEL,
  } = params;
  const apiKey =
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const prompt = buildPrompt(
    restaurants,
    userInput,
    radius,
    maxRecommendations,
    latitude,
    longitude
  );

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!res.ok) {
      console.error("Gemini API error:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as
      | string
      | undefined;

    if (!text) {
      console.error("No text response from Gemini");
      return null;
    }

    // 清理回應文字，提取 JSON
    let cleanText = text.trim();

    // 如果回應包含 markdown 代碼塊，提取其中的內容
    if (cleanText.includes("```json")) {
      const jsonMatch = cleanText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        cleanText = jsonMatch[1].trim();
      }
    } else if (cleanText.includes("```")) {
      const codeMatch = cleanText.match(/```\s*([\s\S]*?)\s*```/);
      if (codeMatch) {
        cleanText = codeMatch[1].trim();
      }
    }

    // 尋找 JSON 開始和結束位置
    const jsonStart = cleanText.indexOf("{");
    const jsonEnd = cleanText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("No valid JSON found in response");
      return null;
    }

    const jsonText = cleanText.slice(jsonStart, jsonEnd + 1);

    try {
      const parsed = JSON.parse(jsonText);

      // 驗證回應格式
      if (!parsed || typeof parsed !== "object") {
        console.error("Invalid JSON structure");
        return null;
      }

      if (!Array.isArray(parsed.ids)) {
        console.error("Missing or invalid ids array");
        return null;
      }

      // 過濾掉無效的 ID
      const validIds = parsed.ids.filter(
        (id: unknown) => typeof id === "string" && id.trim().length > 0
      ) as string[];

      if (validIds.length === 0) {
        console.error("No valid IDs found");
        return null;
      }

      // 限制最大推薦數量
      const limitedIds = validIds.slice(0, maxRecommendations);

      // 處理 userMessage，清理 markdown 格式
      let userMessage =
        parsed.userMessage ||
        `我在 ${(radius / 1000).toFixed(1)}km 範圍內為你找到了 ${
          limitedIds.length
        } 間不錯的餐廳！`;

      // 清理 markdown 格式
      userMessage = userMessage
        .replace(/\*\*(.*?)\*\*/g, "$1") // 移除粗體
        .replace(/\*(.*?)\*/g, "$1") // 移除斜體
        .replace(/`(.*?)`/g, "$1") // 移除代碼
        .replace(/^#{1,6}\s+/gm, "") // 移除標題
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 移除連結
        .replace(/^[-*+]\s+/gm, "• ") // 轉換列表
        .replace(/^\d+\.\s+/gm, "") // 移除數字列表
        .replace(/^[-*_]{3,}$/gm, "") // 移除水平線
        .replace(/^>\s+/gm, "") // 移除引用
        .replace(/\n\s*\n\s*\n/g, "\n\n") // 清理多餘空行
        .trim();

      return {
        ids: limitedIds,
        reason: userMessage,
      };
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return null;
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return null;
  }
}
