import { Restaurant } from "@/types";

type GeminiModel = "gemini-1.5-flash" | "gemini-1.5-pro";

interface RerankParams {
  restaurants: Restaurant[];
  userInput: string;
  latitude: number;
  longitude: number;
  topK?: number;
  model?: GeminiModel;
}

function buildPrompt(restaurants: Restaurant[], userInput: string) {
  const guidance = `你是一個貼心的在地美食顧問，目標是幫助使用者找到最適合的餐廳。

**核心原則：**
1. **永遠給出推薦**：即使條件很嚴格或選項有限，也要從現有選項中挑選最適合的
2. **誠實說明理由**：清楚解釋為什麼選擇這些餐廳，包括優點和限制
3. **實用導向**：重點是解決問題，不是挑剔餐廳
4. **正面鼓勵**：用友善語氣，鼓勵使用者嘗試

**排序原則（靈活運用）：**
1. **距離是王道**：距離近的餐廳優先，但不要過於嚴格
2. **評分參考**：有評分就參考，沒有也沒關係
3. **需求匹配**：盡量符合使用者需求，但不要過度挑剔
4. **實用導向**：重點是解決問題，不是製造焦慮

**分析重點：**
- 參考評論內容，了解餐廳特色和顧客感受
- 考慮價格範圍是否合理
- 評估餐廳類型是否適合需求
- 注意營業時間和即時可用性

**回傳格式：**
{
  "ids": ["restaurant_id_1", "restaurant_id_2", ...],
  "reason": "誠實的推薦理由，必須包含：
    - 整體推薦策略（如何平衡各種考量）
    - 各餐廳的優點和特色
    - 可能的限制或注意事項（誠實說明）
    - 為什麼選擇這些餐廳（即使不是完美符合需求）
    - 實用建議（如何選擇、參考什麼等）
    - 鼓勵性的結語"
}

**重要提醒：**
- 絕對不要因為條件嚴格就放棄推薦
- 必須從現有選項中選擇最適合的
- 誠實說明選擇的理由和限制
- 用正面、鼓勵的語氣
- 如果選項有限，要誠實說明但保持樂觀
- 絕對不要在回應中顯示任何技術細節（如 ID、API 參數等）
- 只提供對使用者有用的餐廳資訊和建議
- 必須回傳有效的 JSON 格式，不要包含其他文字
- 只能推薦提供的餐廳列表中的餐廳，不要提到列表外的餐廳
- 不要使用任何 markdown 格式（如粗體、斜體、代碼等），只使用純文字

特殊情況處理：
- 如果使用者要求很嚴格：誠實說明現有選項的限制，但還是推薦最接近的
- 如果選項很少：說明為什麼這些是當下最好的選擇
- 如果完全不符合需求：推薦最實用的替代方案，並說明理由
- **如果沒有完全符合需求的餐廳：從提供的列表中選擇最接近的，誠實說明限制**`;

  const items = restaurants.map((r) => ({
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
    cuisineType: r.menu?.cuisineType || [],
    // 移除 id 欄位，避免 AI 在回應中顯示
  }));

  return `${guidance}

**使用者需求：** ${userInput || "(未指定特殊需求)"}

**候選餐廳資料：**
${JSON.stringify(items, null, 2)}

請仔細分析每個餐廳的優缺點，並提供最適合的排序結果。只回傳 JSON 格式，不要其他文字。`;
}

export async function rerankWithGemini(
  params: RerankParams
): Promise<{ ids: string[]; reason?: string } | null> {
  const {
    restaurants,
    userInput,
    topK = 8,
    model = "gemini-1.5-flash",
  } = params;
  const apiKey =
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const prompt = buildPrompt(restaurants.slice(0, topK), userInput);

  try {
    // Minimal REST call to Gemini (Text-only prompt via Generative Language API)
    // https://ai.google.dev/gemini-api/docs/api/rest
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3, // 降低溫度，讓回應更穩定
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

    // 清理回應文字，移除可能的 markdown 格式
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
      console.error(
        "No valid JSON found in response:",
        cleanText.substring(0, 200)
      );
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

      return {
        ids: validIds,
        reason: parsed.reason || "AI 已為您推薦最適合的餐廳",
      };
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("JSON text:", jsonText);
      return null;
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return null;
  }
}
