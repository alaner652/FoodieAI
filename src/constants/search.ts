import { Clock, DollarSign, MapPin, Star, Users, Utensils } from "lucide-react";

// Search suggestion types definition
export interface SearchSuggestion {
  text: string;
}

export interface SearchCategory {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestions: SearchSuggestion[];
}

// Moderate number of quick suggestions, keeping the most practical options
export const SEARCH_SUGGESTIONS: SearchCategory[] = [
  {
    category: "菜系",
    icon: Utensils,
    suggestions: [
      { text: "日式料理" },
      { text: "義大利麵" },
      { text: "韓式燒肉" },
      { text: "中式小炒" },
      { text: "美式漢堡" },
      { text: "泰式料理" },
    ],
  },
  {
    category: "價格",
    icon: DollarSign,
    suggestions: [
      { text: "不要太貴" },
      { text: "平價美食" },
      { text: "高級餐廳" },
      { text: "CP值高" },
      { text: "經濟實惠" },
      { text: "奢華享受" },
    ],
  },
  {
    category: "距離",
    icon: MapPin,
    suggestions: [
      { text: "走路10分鐘內" },
      { text: "附近500公尺" },
      { text: "開車15分鐘" },
      { text: "捷運站附近" },
    ],
  },
  {
    category: "特色",
    icon: Star,
    suggestions: [
      { text: "適合約會" },
      { text: "網美餐廳" },
      { text: "安靜環境" },
      { text: "親子友善" },
      { text: "寵物友善" },
      { text: "戶外座位" },
    ],
  },
  {
    category: "時間",
    icon: Clock,
    suggestions: [
      { text: "24小時營業" },
      { text: "早餐" },
      { text: "宵夜" },
      { text: "下午茶" },
      { text: "午餐" },
    ],
  },
  {
    category: "用餐場景",
    icon: Users,
    suggestions: [
      { text: "一人用餐" },
      { text: "情侶約會" },
      { text: "朋友聚餐" },
      { text: "家庭聚餐" },
      { text: "商務聚餐" },
      { text: "團體聚會" },
    ],
  },
];

// Popular combination suggestions
export const POPULAR_COMBOS: SearchSuggestion[] = [
  {
    text: "日式料理",
  },
  {
    text: "義式料理",
  },
  {
    text: "韓式料理",
  },
  {
    text: "中式料理",
  },
];
