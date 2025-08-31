import { Search, Send, Shuffle } from "lucide-react";

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
        {/* Search Input Box */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="例如：想要吃日式料理，不要太貴，走路10分鐘內...（可選）"
          className="py-3 text-base"
          leftIcon={Search}
          disabled={isLoading}
        />

        {/* Button Area */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="group relative inline-flex items-center justify-center px-10 py-4 xl:px-8 xl:py-3 text-lg xl:text-base font-bold text-white bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg overflow-hidden min-w-[160px]"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Button Content */}
            <div className="relative flex items-center space-x-3">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 xl:w-4 xl:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="tracking-wide">
                    {UI_CONFIG.LOADING_TEXT}
                  </span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 xl:w-4 xl:h-4 text-white" />
                  <span className="tracking-wide font-bold">開始推薦</span>
                </>
              )}
            </div>

            {/* Bottom Glow */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-orange-500/50 via-pink-500/50 to-red-500/50 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </button>

          {/* Random Select Button */}
          {onRandomPick && (
            <button
              type="button"
              onClick={onRandomPick}
              disabled={isLoading || isRandomLoading}
              className="group relative inline-flex items-center justify-center px-8 py-4 xl:px-6 xl:py-3 text-lg xl:text-base font-semibold text-orange-600 bg-white border-2 border-orange-300 rounded-2xl hover:bg-orange-50 hover:border-orange-400 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md min-w-[140px]"
            >
              {/* Subtle Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

              <div className="relative flex items-center space-x-2">
                {isRandomLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="tracking-wide">隨機選擇中...</span>
                  </>
                ) : (
                  <>
                    <Shuffle className="w-4 h-4 text-orange-600" />
                    <span className="tracking-wide font-semibold">
                      完全隨機
                    </span>
                  </>
                )}
              </div>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
