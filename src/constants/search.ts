import { Clock, DollarSign, MapPin, Star, Users, Utensils } from "lucide-react";

// Search suggestion types definition
export interface SearchSuggestion {
  text: string;
  emoji: string;
}

export interface SearchCategory {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestions: SearchSuggestion[];
}

export interface PopularCombo {
  text: string;
  emoji: string;
}

// Moderate number of quick suggestions, keeping the most practical options
export const SEARCH_SUGGESTIONS: SearchCategory[] = [
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

// Popular combination suggestions
export const POPULAR_COMBOS: PopularCombo[] = [
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
];
