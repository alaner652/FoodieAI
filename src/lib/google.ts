import { Restaurant } from "@/types";
import { MAP_CONFIG } from "@/lib/config";

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
    openNow = MAP_CONFIG.GOOGLE_PLACES.OPEN_NOW,
    language = MAP_CONFIG.GOOGLE_PLACES.LANGUAGE,
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
  url.searchParams.set("type", MAP_CONFIG.GOOGLE_PLACES.TYPE);
  url.searchParams.set("language", language);
  if (openNow) url.searchParams.set("opennow", "true");
  if (keyword && keyword.trim().length > 0)
    url.searchParams.set("keyword", keyword.trim());

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Google Places request failed: ${res.status}`);
  }
  const data: NearbySearchResponse = await res.json();
  
  // 改進錯誤處理和日誌記錄
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    const msg = data.error_message || data.status;
    console.error("Google Places API error:", {
      status: data.status,
      error_message: data.error_message,
      request_url: url.toString().replace(apiKey, "API_KEY_HIDDEN"),
      params: { latitude, longitude, radius, keyword, openNow }
    });
    throw new Error(`Google Places error: ${msg}`);
  }
  
  // 記錄搜尋結果
  console.log("Google Places search result:", {
    status: data.status,
    results_count: data.results?.length || 0,
    radius_km: (radius / 1000).toFixed(1),
    keyword: keyword || "無"
  });

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
    reviews: (r.reviews || []).slice(0, 3).map((rev) => ({
      authorName: rev.author_name,
      rating: rev.rating,
      time: rev.relative_time_description,
      text: rev.text,
      language: rev.language,
    })),
  } as Partial<Restaurant>;
}
