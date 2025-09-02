import { POPULAR_COMBOS, SEARCH_SUGGESTIONS } from "@/constants/search";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
}

export default function QuickSuggestions({
  onSuggestionClick,
  isLoading = false,
}: QuickSuggestionsProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);

    // Add to recent searches (keep only last 3)
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== suggestion);
      return [suggestion, ...filtered].slice(0, 3);
    });
  };

  // Get top suggestions for collapsed view
  const topSuggestions = [
    ...SEARCH_SUGGESTIONS.flatMap((category) =>
      category.suggestions.slice(0, 0)
    ),
    ...POPULAR_COMBOS.slice(0, 4),
  ];

  return (
    <div className="max-w-4xl mx-auto mb-12">
      {/* Recent Searches - Clean list */}
      {recentSearches.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
            最近搜尋
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={`${search}-${index}`}
                onClick={() => handleSuggestionClick(search)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Suggestions Block */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header - Clickable to expand/collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">💡</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">快速建議</h3>
              <p className="text-xs text-gray-500">
                {isExpanded ? "點擊收起" : "點擊展開更多建議"}
              </p>
            </div>
          </div>

          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Content */}
        <div className="border-t border-gray-100 p-4">
          {isExpanded ? (
            /* Expanded View - All suggestions with categories */
            <div className="space-y-4">
              {SEARCH_SUGGESTIONS.map((category) => (
                <div key={category.category} className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {category.suggestions.map((suggestion) => (
                      <button
                        key={suggestion.text}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        disabled={isLoading}
                        className="p-2 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 disabled:opacity-50 transition-all duration-200 text-center"
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Popular Combinations */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  熱門組合
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {POPULAR_COMBOS.map((combo) => (
                    <button
                      key={combo.text}
                      onClick={() => handleSuggestionClick(combo.text)}
                      disabled={isLoading}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 disabled:opacity-50 transition-all duration-200 text-center"
                    >
                      <span className="mr-1">{combo.emoji}</span>
                      {combo.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed View - Top suggestions only */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {topSuggestions.map((suggestion) => (
                <button
                  key={suggestion.text}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  disabled={isLoading}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 disabled:opacity-50 transition-all duration-200 text-center"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
