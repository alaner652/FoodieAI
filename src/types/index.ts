export interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: number;
  cuisine: string;
  priceRange: string;
  openNow: boolean;
  placeId?: string;
  photoUrl?: string;
  mapsUrl?: string;
  website?: string;
  userRatingsTotal?: number;
  // 新增菜單相關欄位
  menu?: {
    items?: Array<{
      name: string;
      description?: string;
      price?: string;
      category?: string;
    }>;
    specialties?: string[]; // 特色菜餚
    popularDishes?: string[]; // 熱門菜餚
    cuisineType?: string[]; // 詳細菜系類型
  };
  openingHours?: {
    periods?: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
    weekdayText?: string[];
  };
  reviews?: Array<{
    authorName?: string;
    rating?: number;
    time?: string;
    text?: string;
    language?: string;
  }>;
}

export interface UserPreference {
  cuisine?: string[];
  priceRange?: "low" | "medium" | "high" | "any";
  distance?: "near" | "medium" | "far" | "any";
  mood?: string[];
  dietary?: string[];
  occasion?: string;
  timeOfDay?: "breakfast" | "lunch" | "dinner" | "any";
}

export interface RecommendationRequest {
  userInput: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // meters
}

export interface RecommendationResponse {
  success: boolean;
  data?: {
    recommendations: Restaurant[];
    totalFound: number;
    userInput: string;
    searchRadius?: number;
    aiReason?: string;
    aiRecommendedCount?: number; // 新增：AI 實際推薦的餐廳數量
  };
  error?: string;
}
