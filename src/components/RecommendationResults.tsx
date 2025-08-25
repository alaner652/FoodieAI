import { Restaurant } from "@/types";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";
import RestaurantCard from "./RestaurantCard";

interface RecommendationResultsProps {
  recommendations: Restaurant[];
  onRandomPick?: () => void;
  onViewDetails?: (restaurant: Restaurant) => void;
  aiReason?: string;
}

// 內容類型識別模式
const CONTENT_PATTERNS = {
  STRATEGY: {
    keywords: ["考慮到", "根據", "為您推薦", "我根據", "基於", "綜合考量"],
    style: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
      titleColor: "text-blue-900",
      textColor: "text-blue-800",
      icon: Sparkles,
      title: "推薦策略",
    },
  },
  RESTAURANT_INTRO: {
    keywords: ["距離您最近", "接下來", "首先", "最後"],
    patterns: [
      ["『", "』"],
      ["'", "'"],
      ['"', '"'],
    ] as const,
    style: {
      bgColor: "bg-white",
      borderColor: "border-gray-200",
      iconBg: "bg-green-500",
      textColor: "text-gray-700",
      icon: MapPin,
    },
  },
  POSITIVE_REVIEW: {
    keywords: [
      "不錯",
      "很好",
      "值得",
      "推薦",
      "讚賞",
      "美味",
      "優質",
      "滿意",
      "喜歡",
    ],
    style: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-500",
      titleColor: "text-green-900",
      textColor: "text-green-800",
      icon: CheckCircle,
      title: "推薦理由",
    },
  },
  WARNING: {
    keywords: [
      "注意",
      "但是",
      "不過",
      "考量",
      "然而",
      "雖然",
      "評價褒貶",
      "有些顧客",
      "反應",
      "偏硬",
      "過熟",
    ],
    style: {
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      iconBg: "bg-orange-500",
      titleColor: "text-orange-900",
      textColor: "text-orange-800",
      icon: AlertCircle,
      title: "注意事項",
    },
  },
  SUGGESTION: {
    keywords: ["建議", "可以考慮", "適合", "選擇", "參考", "決定"],
    style: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconBg: "bg-yellow-500",
      titleColor: "text-yellow-900",
      textColor: "text-yellow-800",
      icon: Star,
      title: "實用建議",
    },
  },
  CONCLUSION: {
    keywords: ["希望", "祝您", "用餐愉快", "找到理想", "幫助您", "以上建議"],
    style: {
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500",
      titleColor: "text-purple-900",
      textColor: "text-purple-800",
      icon: Clock,
      title: "溫馨提醒",
    },
  },
} as const;

/**
 * 識別內容類型
 */
function identifyContentType(
  text: string
): keyof typeof CONTENT_PATTERNS | null {
  for (const [type, config] of Object.entries(CONTENT_PATTERNS)) {
    // 檢查關鍵詞
    if (config.keywords?.some((keyword) => text.includes(keyword))) {
      return type as keyof typeof CONTENT_PATTERNS;
    }

    // 檢查模式（如引號）
    if (
      "patterns" in config &&
      config.patterns?.some(
        (pattern) => text.includes(pattern[0]) && text.includes(pattern[1])
      )
    ) {
      return type as keyof typeof CONTENT_PATTERNS;
    }
  }

  return null;
}

/**
 * 渲染內容卡片
 */
function renderContentCard(text: string, index: number): React.ReactNode {
  const contentType = identifyContentType(text);

  if (!contentType) {
    // 一般段落
    return (
      <div
        key={index}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
      >
        <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
      </div>
    );
  }

  const config = CONTENT_PATTERNS[contentType];
  const IconComponent = config.style.icon;

  return (
    <div
      key={index}
      className={`${config.style.bgColor} border ${config.style.borderColor} rounded-lg p-4`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-6 h-6 ${config.style.iconBg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
        >
          <IconComponent className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1">
          {"title" in config.style && config.style.title && (
            <h5
              className={`text-sm font-medium ${config.style.titleColor} mb-1`}
            >
              {config.style.title}
            </h5>
          )}
          <p className={`text-sm ${config.style.textColor} leading-relaxed`}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationResults({
  recommendations,
  onRandomPick,
  onViewDetails,
  aiReason,
}: RecommendationResultsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            沒有找到符合條件的餐廳
          </h3>
          <p className="text-gray-700">
            請嘗試調整您的搜尋條件，或擴大搜尋範圍
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* 結果標題 */}
        <div className="bg-white border-b border-gray-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  AI 推薦結果
                </h3>
                <p className="text-sm text-gray-600">
                  找到 {recommendations.length} 家符合條件的餐廳
                </p>
              </div>
            </div>

            {onRandomPick && recommendations.length > 1 && (
              <button
                onClick={onRandomPick}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>隨機選擇</span>
              </button>
            )}
          </div>
        </div>

        {/* 餐廳卡片列表 */}
        <div className="p-6 space-y-5">
          {recommendations.map((restaurant, index) => (
            <div key={restaurant.id} className="relative">
              {/* 排名標籤 */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
              </div>

              <RestaurantCard
                restaurant={restaurant}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>

        {/* AI 排序說明 */}
        {aiReason && (
          <div className="border-t border-gray-100">
            <div className="bg-gray-50 px-6 py-5">
              <div className="flex items-start space-x-4">
                <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    AI 推薦分析
                  </h4>

                  {/* 簡化的 AI 內容 */}
                  {aiReason
                    .split("\n")
                    .map((paragraph, index) =>
                      renderContentCard(paragraph, index)
                    )}

                  {/* 簡化的標籤 */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 shadow-sm">
                      🎯 智能排序
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-green-100 text-green-700 shadow-sm">
                      📍 距離優先
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-purple-100 text-purple-700 shadow-sm">
                      ⭐ 評價參考
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 結果底部信息 */}
        <div className="border-t border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>最後更新：{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
