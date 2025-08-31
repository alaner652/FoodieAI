import { Brain, MapPin, Zap } from "lucide-react";

// 主頁面特色類型定義
export interface HomeFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bgColor: string;
}

// 主頁面預覽特色
export const HOME_FEATURES: HomeFeature[] = [
  {
    icon: Brain,
    title: "AI 智能分析",
    description: "使用 Gemini AI 分析您的需求，從 40+ 間餐廳中智能選擇最適合的推薦",
    bgColor: "from-orange-500 to-orange-600",
  },
  {
    icon: MapPin,
    title: "精確定位",
    description: "支援 GPS 定位，可自定義搜尋範圍（0.2km - 5km），找到最適合的餐廳",
    bgColor: "from-pink-500 to-pink-600",
  },
  {
    icon: Zap,
    title: "快速推薦",
    description: "輸入簡單需求，AI 立即分析並推薦 4 間最佳餐廳，節省您的選擇時間",
    bgColor: "from-red-500 to-red-600",
  },
];

// 統計數據
export const STATS_DATA = [
  { value: "40+", label: "餐廳選擇", color: "text-orange-600" },
  { value: "4", label: "精選推薦", color: "text-pink-600" },
  { value: "5km", label: "最大範圍", color: "text-red-600" },
] as const;
