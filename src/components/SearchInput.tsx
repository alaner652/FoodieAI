import { Search, Sparkles } from "lucide-react";

import Input from "@/components/ui/Input";
import { UI_CONFIG } from "@/lib/config";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onRandomPick?: () => void;
  isLoading: boolean;
  isRandomLoading?: boolean;
  error?: string;
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  onRandomPick,
  isLoading,
  isRandomLoading = false,
}: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit();
  };

  return (
    <div className="max-w-4xl mx-auto mb-8">
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

        {/* 按鈕區域 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* 搜尋按鈕 */}
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

          {/* 隨機選擇按鈕 */}
          {onRandomPick && (
            <button
              type="button"
              onClick={onRandomPick}
              disabled={isLoading || isRandomLoading}
              className="inline-flex items-center justify-center px-6 py-4 xl:px-5 xl:py-3 text-lg xl:text-base font-semibold text-orange-600 bg-white border-2 border-orange-300 rounded-xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isRandomLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>隨機選擇中...</span>
                </>
              ) : (
                <span>完全隨機</span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
