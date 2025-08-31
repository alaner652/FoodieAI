import { POPULAR_COMBOS, SEARCH_SUGGESTIONS } from "@/constants/search";

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
}

export default function QuickSuggestions({
  onSuggestionClick,
  isLoading = false,
}: QuickSuggestionsProps) {
  return (
    <div className="max-w-4xl mx-auto">
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
          {SEARCH_SUGGESTIONS.map((category) => (
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
                    onClick={() => onSuggestionClick(suggestion.text)}
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

        {/* Simplified Popular Combination Suggestions */}
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
            {POPULAR_COMBOS.map((combo) => (
              <button
                key={combo.text}
                onClick={() => onSuggestionClick(combo.text)}
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
    </div>
  );
}
