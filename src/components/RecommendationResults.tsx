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
        <Card variant="outlined" className="p-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              沒有找到符合條件的餐廳
            </h3>
          </div>

          {/* Display AI Suggestions */}
          {aiReason && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">💡</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    AI 建議
                  </h4>
                  <div className="text-sm text-blue-800 whitespace-pre-line">
                    {aiReason}
                  </div>
                </div>
              </div>
            </div>
          )}
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
