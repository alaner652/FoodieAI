import { Restaurant } from "@/types";

interface NearbySearchPlace {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  rating?: number;
  price_level?: number;
  geometry?: {
    location?: { lat: number; lng: number };
  };
  photos?: Array<{ photo_reference: string }>;
}

interface NearbySearchResponse {
  results: NearbySearchPlace[];
  status: string;
  next_page_token?: string;
  error_message?: string;
}

function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function searchNearbyRestaurants(params: {
  latitude: number;
  longitude: number;
  radius: number; // meters
  keyword?: string;
  openNow?: boolean;
  language?: string;
}): Promise<Restaurant[]> {
  const {
    latitude,
    longitude,
    radius,
    keyword,
    openNow = true,
    language = "zh-TW",
  } = params;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY");
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("location", `${latitude},${longitude}`);
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("type", "restaurant");
  url.searchParams.set("language", language);
  if (openNow) url.searchParams.set("opennow", "true");
  if (keyword && keyword.trim().length > 0)
    url.searchParams.set("keyword", keyword.trim());

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Google Places request failed: ${res.status}`);
  }
  const data: NearbySearchResponse = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    const msg = data.error_message || data.status;
    throw new Error(`Google Places error: ${msg}`);
  }

  const restaurants: Restaurant[] = (data.results || []).map((p, index) => {
    const placeLat = p.geometry?.location?.lat ?? 0;
    const placeLng = p.geometry?.location?.lng ?? 0;
    const distanceMeters = haversineDistanceMeters(
      latitude,
      longitude,
      placeLat,
      placeLng
    );

    return {
      id: p.place_id || String(index),
      name: p.name,
      address: p.vicinity || p.formatted_address || "",
      rating: typeof p.rating === "number" ? p.rating : 0,
      distance: Math.round(distanceMeters / 10) / 100, // km with 2 decimals
      cuisine: "restaurant",
      priceRange:
        typeof p.price_level === "number"
          ? "$".repeat(Math.max(1, Math.min(4, p.price_level)))
          : "$$",
      openNow: !!openNow,
      placeId: p.place_id,
      photoUrl:
        p.photos && p.photos.length > 0
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photos[0].photo_reference}&key=${apiKey}`
          : undefined,
    };
  });

  return restaurants;
}

interface PlaceReview {
  author_name?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  language?: string;
}

interface PlaceDetailsResult {
  name?: string;
  formatted_address?: string;
  url?: string; // Google Maps URL
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  photos?: Array<{ photo_reference: string }>;
  reviews?: PlaceReview[];
  opening_hours?: {
    periods?: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
    weekday_text?: string[];
  };
  types?: string[];
  editorial_summary?: {
    overview?: string;
  };
}

interface PlaceDetailsResponse {
  result?: PlaceDetailsResult;
  status: string;
  error_message?: string;
}

export async function fetchPlaceDetails(params: {
  placeId: string;
  language?: string;
  photoApiKeyOverride?: string;
}): Promise<Partial<Restaurant>> {
  const { placeId, language = "zh-TW", photoApiKeyOverride } = params;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_MAPS_API_KEY");

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json"
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set(
    "fields",
    [
      "name",
      "formatted_address",
      "url",
      "website",
      "rating",
      "user_ratings_total",
      "price_level",
      "photos",
      "reviews",
      "opening_hours",
      "types",
      "editorial_summary",
    ].join(",")
  );
  url.searchParams.set("language", language);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Place Details failed: ${res.status}`);
  const data: PlaceDetailsResponse = await res.json();
  if (data.status !== "OK") {
    const msg = data.error_message || data.status;
    throw new Error(`Place Details error: ${msg}`);
  }

  const r = data.result;
  if (!r) return {};

  const photoRef =
    r.photos && r.photos.length > 0 ? r.photos[0].photo_reference : undefined;
  const photoUrl = photoRef
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${
        photoApiKeyOverride || apiKey
      }`
    : undefined;

  // 解析營業時間
  const openingHours = r.opening_hours
    ? {
        periods: r.opening_hours.periods,
        weekdayText: r.opening_hours.weekday_text,
      }
    : undefined;

  // 從評論中提取菜單資訊
  const menuInfo = extractMenuFromReviews(r.reviews || []);

  return {
    address: r.formatted_address || undefined,
    rating: typeof r.rating === "number" ? r.rating : undefined,
    priceRange:
      typeof r.price_level === "number"
        ? "$".repeat(Math.max(1, Math.min(4, r.price_level)))
        : undefined,
    photoUrl,
    mapsUrl: r.url || undefined,
    website: r.website || undefined,
    userRatingsTotal:
      typeof r.user_ratings_total === "number"
        ? r.user_ratings_total
        : undefined,
    openingHours,
    menu: menuInfo,
    reviews: (r.reviews || []).slice(0, 3).map((rev) => ({
      authorName: rev.author_name,
      rating: rev.rating,
      time: rev.relative_time_description,
      text: rev.text,
      language: rev.language,
    })),
  } as Partial<Restaurant>;
}

// 從評論中提取菜單資訊的輔助函數
function extractMenuFromReviews(reviews: PlaceReview[]): Restaurant["menu"] {
  const menuItems: Array<{
    name: string;
    description?: string;
    price?: string;
    category?: string;
  }> = [];
  const specialties: string[] = [];
  const popularDishes: string[] = [];
  const cuisineTypes: string[] = [];

  // 常見的菜系關鍵詞
  const cuisineKeywords = {
    中式: [
      "中餐",
      "中式",
      "川菜",
      "粵菜",
      "湘菜",
      "魯菜",
      "蘇菜",
      "浙菜",
      "閩菜",
      "徽菜",
    ],
    日式: ["日式", "壽司", "拉麵", "天婦羅", "刺身", "和食"],
    韓式: ["韓式", "韓料", "烤肉", "泡菜", "石鍋拌飯"],
    泰式: ["泰式", "泰國菜", "冬陰功", "咖哩"],
    義式: ["義式", "義大利", "披薩", "義大利麵", "燉飯"],
    美式: ["美式", "漢堡", "牛排", "BBQ"],
    法式: ["法式", "法國菜", "鵝肝", "蝸牛"],
    越式: ["越式", "越南菜", "河粉", "春捲"],
  };

  reviews.forEach((review) => {
    if (!review.text) return;

    const text = review.text.toLowerCase();

    // 提取菜名（通常在引號或特定格式中）
    const dishMatches = text.match(/["「]([^"」]+)["」]/g);
    if (dishMatches) {
      dishMatches.forEach((match) => {
        const dishName = match.replace(/["「」]/g, "");
        if (dishName.length > 1 && dishName.length < 20) {
          menuItems.push({ name: dishName });
        }
      });
    }

    // 提取特色菜餚（包含"推薦"、"必點"、"招牌"等關鍵詞）
    const specialtyKeywords = ["推薦", "必點", "招牌", "特色", "經典", "人氣"];
    specialtyKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        const sentences = text.split(/[。！？]/);
        sentences.forEach((sentence) => {
          if (sentence.includes(keyword)) {
            const dishes = sentence.match(/[「"]([^"」]+)[」"]/g);
            if (dishes) {
              dishes.forEach((dish) => {
                const dishName = dish.replace(/["「」]/g, "");
                if (!specialties.includes(dishName)) {
                  specialties.push(dishName);
                }
              });
            }
          }
        });
      }
    });

    // 提取熱門菜餚（包含"好吃"、"美味"、"讚"等正面評價）
    const popularKeywords = ["好吃", "美味", "讚", "棒", "不錯", "推薦"];
    popularKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        const sentences = text.split(/[。！？]/);
        sentences.forEach((sentence) => {
          if (sentence.includes(keyword)) {
            const dishes = sentence.match(/[「"]([^"」]+)[」"]/g);
            if (dishes) {
              dishes.forEach((dish) => {
                const dishName = dish.replace(/["「」]/g, "");
                if (!popularDishes.includes(dishName)) {
                  popularDishes.push(dishName);
                }
              });
            }
          }
        });
      }
    });

    // 識別菜系類型
    Object.entries(cuisineKeywords).forEach(([cuisine, keywords]) => {
      keywords.forEach((keyword) => {
        if (text.includes(keyword) && !cuisineTypes.includes(cuisine)) {
          cuisineTypes.push(cuisine);
        }
      });
    });
  });

  return {
    items: menuItems.length > 0 ? menuItems.slice(0, 10) : undefined,
    specialties: specialties.length > 0 ? specialties.slice(0, 5) : undefined,
    popularDishes:
      popularDishes.length > 0 ? popularDishes.slice(0, 5) : undefined,
    cuisineType: cuisineTypes.length > 0 ? cuisineTypes : undefined,
  };
}
