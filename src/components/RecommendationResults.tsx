import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { Restaurant } from "@/types";
import { Sparkles } from "lucide-react";
import RestaurantCard from "./RestaurantCard";

interface RecommendationResultsProps {
  recommendations: Restaurant[];
  onRandomPick?: () => void;
  aiReason?: string;
  aiRecommendedCount?: number; // AI recommendation count
}

/**
 * 渲染 AI 推薦說明
 */
function renderAIReason(aiReason: string): React.ReactNode {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">AI 推薦分析</h3>
      </div>

      <div className="text-gray-700 leading-relaxed text-lg mb-8">
        {aiReason.split("\n").map((paragraph, index) => {
          if (!paragraph.trim()) return null;

          return (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Feature Tags */}
      <div className="flex flex-wrap justify-center gap-3">
        <Badge variant="primary" size="sm">
          🎯 智能排序
        </Badge>
        <Badge variant="success" size="sm">
          📍 距離優先
        </Badge>
        <Badge variant="secondary" size="sm">
          ⭐ 評價參考
        </Badge>
      </div>
    </div>
  );
}

export default function RecommendationResults({
  recommendations,
  aiReason,
}: RecommendationResultsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card variant="outlined" className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-orange-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            沒有找到符合條件的餐廳
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            別擔心！AI 會為您提供一些建議，幫助您調整搜尋條件
          </p>

          {/* AI Suggestions */}
          {aiReason && (
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">💡</span>
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-lg font-semibold text-orange-800 mb-3">
                    AI 智能建議
                  </h4>
                  <div className="text-sm text-orange-700 leading-relaxed whitespace-pre-line">
                    {aiReason}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Tips */}
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4">💡 試試這些方法：</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="primary" size="sm">
                🔍 調整搜尋關鍵字
              </Badge>
              <Badge variant="primary" size="sm">
                📍 擴大搜尋範圍
              </Badge>
              <Badge variant="primary" size="sm">
                🍽️ 嘗試不同料理類型
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Restaurant Card List */}
      <div className="grid gap-6 mb-12 grid-cols-1">
        {recommendations.map((restaurant, index) => (
          <div key={restaurant.id} className="relative w-full">
            {/* Ranking Tag */}
            <div className="absolute -top-3 -left-3 z-10">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {index + 1}
                </span>
              </div>
            </div>

            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>

      {/* AI Recommendation Description */}
      {aiReason && (
        <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 border border-orange-200 rounded-2xl p-8">
          {renderAIReason(aiReason)}
        </div>
      )}
    </div>
  );
}
