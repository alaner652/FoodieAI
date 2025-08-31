import {
  Clock,
  DollarSign,
  MapPin,
  Search,
  Sparkles,
  Star,
  Users,
  Utensils,
} from "lucide-react";

import Input from "@/components/ui/Input";
import { UI_CONFIG } from "@/lib/config";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
}

// 中等數量的快速建議，保留最實用的選項
const MODERATE_SUGGESTIONS = [
  {
    category: "菜系",
    icon: Utensils,
    suggestions: [
      { text: "日式料理", emoji: "🍣" },
      { text: "義大利麵", emoji: "🍝" },
      { text: "韓式燒肉", emoji: "🥩" },
      { text: "中式小炒", emoji: "🥘" },
      { text: "美式漢堡", emoji: "🍔" },
      { text: "泰式料理", emoji: "🍜" },
    ],
  },
  {
    category: "價格",
    icon: DollarSign,
    suggestions: [
      { text: "不要太貴", emoji: "💰" },
      { text: "平價美食", emoji: "💵" },
      { text: "高級餐廳", emoji: "💎" },
      { text: "CP值高", emoji: "⭐" },
      { text: "經濟實惠", emoji: "🪙" },
      { text: "奢華享受", emoji: "👑" },
    ],
  },
  {
    category: "距離",
    icon: MapPin,
    suggestions: [
      { text: "走路10分鐘內", emoji: "🚶" },
      { text: "附近500公尺", emoji: "📍" },
      { text: "開車15分鐘", emoji: "🚗" },
      { text: "捷運站附近", emoji: "🚇" },
    ],
  },
  {
    category: "特色",
    icon: Star,
    suggestions: [
      { text: "適合約會", emoji: "💕" },
      { text: "網美餐廳", emoji: "📸" },
      { text: "安靜環境", emoji: "🤫" },
      { text: "親子友善", emoji: "👶" },
      { text: "寵物友善", emoji: "🐕" },
      { text: "戶外座位", emoji: "🌳" },
    ],
  },
  {
    category: "時間",
    icon: Clock,
    suggestions: [
      { text: "營業中", emoji: "🕐" },
      { text: "24小時營業", emoji: "🌙" },
      { text: "早餐", emoji: "🌅" },
      { text: "宵夜", emoji: "🌃" },
      { text: "下午茶", emoji: "☕" },
      { text: "午餐", emoji: "🍽️" },
    ],
  },
  {
    category: "用餐場景",
    icon: Users,
    suggestions: [
      { text: "一人用餐", emoji: "👤" },
      { text: "情侶約會", emoji: "💑" },
      { text: "朋友聚餐", emoji: "👥" },
      { text: "家庭聚餐", emoji: "👨‍👩‍👧‍👦" },
      { text: "商務聚餐", emoji: "💼" },
      { text: "團體聚會", emoji: "🎉" },
    ],
  },
];

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit();
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;

    // 如果輸入框已有內容，在後面添加；否則直接設置
    if (value.trim()) {
      onChange(value + "，" + suggestion);
    } else {
      onChange(suggestion);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 搜尋輸入框 */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="例如：想要吃日式料理，不要太貴，走路10分鐘內...（可選）"
          className="py-3 text-base"
          leftIcon={Search}
          disabled={isLoading}
        />

        {/* 搜尋按鈕 */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="group relative inline-flex items-center justify-center px-8 py-4 xl:px-6 xl:py-3 text-lg xl:text-base font-semibold text-white bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg overflow-hidden"
          >
            {/* 背景動畫效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* 按鈕內容 */}
            <div className="relative flex items-center space-x-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 xl:w-4 xl:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{UI_CONFIG.LOADING_TEXT}</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 xl:w-7 xl:h-7 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Sparkles className="w-5 h-5 xl:w-4 xl:h-4 text-white" />
                  </div>
                  <span>開始推薦</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* 搜尋建議 */}
        {!value.trim() && (
          <div className="mt-6 bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 rounded-xl border border-orange-200 p-5 xl:p-4 shadow-sm">
            <div className="text-center mb-4 xl:mb-3">
              <h4 className="text-lg xl:text-base font-bold text-orange-900 mb-2 xl:mb-1.5">
                🎯 快速建議
              </h4>
              <p className="text-sm xl:text-xs text-orange-700">
                點擊建議快速組合搜尋條件，找到最適合的餐廳
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 xl:gap-3">
              {MODERATE_SUGGESTIONS.map((category) => (
                <div
                  key={category.category}
                  className="bg-white rounded-xl border border-gray-100 p-4 xl:p-3 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-3 xl:mb-2.5">
                    <div className="w-8 h-8 xl:w-7 xl:h-7 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                      <category.icon className="w-4 h-4 xl:w-3.5 xl:h-3.5 text-white" />
                    </div>
                    <h4 className="text-base xl:text-sm font-semibold text-gray-900">
                      {category.category}
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:gap-1.5">
                    {category.suggestions.map((suggestion) => (
                      <button
                        key={suggestion.text}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        disabled={isLoading}
                        className="px-4 py-2 xl:px-3.5 xl:py-1.5 bg-gray-50 border border-gray-200 rounded-lg xl:rounded-md text-sm xl:text-xs text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 min-w-fit"
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 簡化的熱門組合建議 */}
            <div className="mt-6 bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 rounded-xl border border-orange-200 p-5 xl:p-4 shadow-sm">
              <div className="text-center mb-4 xl:mb-3">
                <h4 className="text-lg xl:text-base font-bold text-orange-900 mb-2 xl:mb-1.5">
                  🔥 熱門組合
                </h4>
                <p className="text-sm xl:text-xs text-orange-700">
                  一鍵套用常用搜尋組合
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 xl:gap-3">
                {[
                  {
                    text: "日式料理 + 不要太貴 + 走路10分鐘內",
                    emoji: "🍣",
                  },
                  {
                    text: "義大利麵 + 適合約會 + 安靜環境",
                    emoji: "🍝",
                  },
                  {
                    text: "韓式燒肉 + 網美餐廳 + 營業中",
                    emoji: "🥩",
                  },
                  {
                    text: "中式小炒 + 平價美食 + 附近500公尺",
                    emoji: "🥘",
                  },
                ].map((combo) => (
                  <button
                    key={combo.text}
                    onClick={() => onChange(combo.text)}
                    disabled={isLoading}
                    className="flex items-center space-x-3 xl:space-x-2 px-4 py-3 xl:px-3 xl:py-2.5 bg-white border border-orange-200 rounded-xl xl:rounded-lg text-sm xl:text-xs text-orange-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50"
                  >
                    <span className="text-lg xl:text-base">{combo.emoji}</span>
                    <span className="text-left">{combo.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
