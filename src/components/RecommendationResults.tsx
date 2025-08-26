import { Restaurant } from "@/types";
import { RefreshCw, Sparkles } from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import { UI_CONFIG } from "@/lib/config";

interface RecommendationResultsProps {
  recommendations: Restaurant[];
  onRandomPick?: () => void;
  onViewDetails?: (restaurant: Restaurant) => void;
  aiReason?: string;
  aiRecommendedCount?: number; // 新增：AI 推薦數量
}

/**
 * 渲染 AI 推薦說明
 */
function renderAIReason(aiReason: string): React.ReactNode {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">
            AI 推薦分析
          </h4>

          <div className="prose prose-sm max-w-none">
            {aiReason.split("\n").map((paragraph, index) => {
              if (!paragraph.trim()) return null;

              return (
                <p
                  key={index}
                  className="text-gray-700 leading-relaxed mb-3 last:mb-0"
                >
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* 簡化的標籤 */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-blue-200">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
              🎯 智能排序
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
              📍 距離優先
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
              ⭐ 評價參考
            </span>
          </div>
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
  aiRecommendedCount,
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
                  {aiRecommendedCount ? (
                    <>
                      AI 智能推薦了 {aiRecommendedCount} 間餐廳
                      {recommendations.length !== aiRecommendedCount && (
                        <span className="text-gray-500">
                          （顯示 {recommendations.length} 間）
                        </span>
                      )}
                    </>
                  ) : (
                    `找到 ${recommendations.length} 間符合條件的餐廳`
                  )}
                </p>
              </div>
            </div>

            {onRandomPick && recommendations.length > 1 && (
              <button
                onClick={onRandomPick}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{UI_CONFIG.BUTTON_TEXTS.RANDOM_PICK}</span>
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

        {/* AI 推薦說明 */}
        {aiReason && (
          <div className="border-t border-gray-100 px-6 py-5">
            {renderAIReason(aiReason)}
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
