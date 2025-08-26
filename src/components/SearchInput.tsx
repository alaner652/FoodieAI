import { Search, Sparkles } from "lucide-react";
import { UI_CONFIG } from "@/lib/config";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  suggestions?: string[];
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  suggestions = UI_CONFIG.SEARCH_SUGGESTIONS,
}: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 搜尋輸入框 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="例如：想要吃日式料理，不要太貴，走路10分鐘內...（可選）"
            className="block w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
            disabled={isLoading}
          />
        </div>

        {/* 提交按鈕 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{UI_CONFIG.LOADING_TEXT}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{UI_CONFIG.BUTTON_TEXTS.START_RECOMMEND}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 快速建議 */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-3">快速建議（可選）：</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onChange(suggestion)}
              disabled={isLoading}
              className="px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
