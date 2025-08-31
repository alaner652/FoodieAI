import { Clock, MapPin, Sparkles } from "lucide-react";

// 功能特色類型定義
export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

// 預設功能特色
export const DEFAULT_FEATURES: Feature[] = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI 智能分析",
    description: "運用 AI 技術，深度理解您的偏好，提供個性化推薦",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "精準定位",
    description: "結合位置數據，確保推薦的餐廳都在您方便到達的範圍內",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "快速決策",
    description: "告別選擇困難症，幾秒鐘內獲得最適合的餐廳推薦",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];
