import { Restaurant } from "@/types";

// Google Places API Configuration
const PLACES_CONFIG = {
  BASE_URL: "https://maps.googleapis.com/maps/api/place",
  LANGUAGE: "zh-TW",
  TYPE: "restaurant",
  MAX_PHOTO_WIDTH: 800,
} as const;

// Place search result interface
interface PlaceSearchResult {
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

// Search response interface
interface SearchResponse {
  results: PlaceSearchResult[];
  status: string;
  next_page_token?: string;
  error_message?: string;
}

// Place details interface
interface PlaceDetails {
  name?: string;
  formatted_address?: string;
  url?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  photos?: Array<{ photo_reference: string }>;
  reviews?: Array<{
    author_name?: string;
    rating?: number;
    relative_time_description?: string;
    text?: string;
    language?: string;
  }>;
  opening_hours?: {
    periods?: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
    weekday_text?: string[];
  };
  types?: string[];
  editorial_summary?: { overview?: string };
}

// Place details response interface
interface DetailsResponse {
  result?: PlaceDetails;
  status: string;
  error_message?: string;
}

// Calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // Earth radius (meters)

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

// Get API Key
function getApiKey(userApiKey?: string): string {
  const apiKey = userApiKey || process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("缺少 Google Places API Key");
  return apiKey;
}

// Search nearby restaurants
export async function searchNearbyRestaurants(params: {
  latitude: number;
  longitude: number;
  radius: number;
  keyword?: string;
  openNow?: boolean;
  maxResults?: number;
  userApiKey?: string;
}): Promise<Restaurant[]> {
  const {
    latitude,
    longitude,
    radius,
    keyword,
    openNow = true,
    maxResults = 40,
    userApiKey,
  } = params;
  const apiKey = getApiKey(userApiKey);
  const allRestaurants: Restaurant[] = [];
  let pageToken: string | undefined;
  let pageCount = 0;

  do {
    // Build search URL
    const url = new URL(`${PLACES_CONFIG.BASE_URL}/nearbysearch/json`);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("location", `${latitude},${longitude}`);
    url.searchParams.set("radius", String(radius));
    url.searchParams.set("type", PLACES_CONFIG.TYPE);
    url.searchParams.set("language", PLACES_CONFIG.LANGUAGE);

    if (openNow) url.searchParams.set("opennow", "true");
    if (keyword?.trim()) url.searchParams.set("keyword", keyword.trim());
    if (pageToken) url.searchParams.set("pagetoken", pageToken);

    // Send request
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) throw new Error(`搜尋請求失敗: ${response.status}`);

    const data: SearchResponse = await response.json();

    // Check response status
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`搜尋錯誤: ${data.error_message || data.status}`);
    }

    // Process search results
    const pageRestaurants = (data.results || []).map((place, index) => {
      const placeLat = place.geometry?.location?.lat ?? 0;
      const placeLng = place.geometry?.location?.lng ?? 0;
      const distanceMeters = calculateDistance(
        latitude,
        longitude,
        placeLat,
        placeLng
      );

      return {
        id: place.place_id || `temp_${index}`,
        name: place.name,
        address: place.vicinity || place.formatted_address || "",
        rating: place.rating ?? 0,
        distance: Math.round(distanceMeters / 10) / 100,
        cuisine: "restaurant",
        priceRange: place.price_level
          ? "$".repeat(Math.max(1, Math.min(4, place.price_level)))
          : "$$",
        openNow: !!openNow,
        placeId: place.place_id,
        photoUrl: place.photos?.[0]?.photo_reference
          ? `${PLACES_CONFIG.BASE_URL}/photo?maxwidth=${PLACES_CONFIG.MAX_PHOTO_WIDTH}&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
          : undefined,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      };
    });

    allRestaurants.push(...pageRestaurants);
    pageToken = data.next_page_token;
    pageCount++;

    // Check if target count or page limit reached
    if (allRestaurants.length >= maxResults || pageCount >= 3) break;

    // Pagination request interval
    if (pageToken) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } while (pageToken && pageCount < 3);

  return allRestaurants.slice(0, maxResults);
}

// Get place details
export async function getPlaceDetails(params: {
  placeId: string;
  language?: string;
  userApiKey?: string;
}): Promise<Partial<Restaurant>> {
  const { placeId, language = PLACES_CONFIG.LANGUAGE, userApiKey } = params;
  const apiKey = getApiKey(userApiKey);

  const url = new URL(`${PLACES_CONFIG.BASE_URL}/details/json`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("language", language);
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

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) throw new Error(`詳情請求失敗: ${response.status}`);

  const data: DetailsResponse = await response.json();
  if (data.status !== "OK") {
    throw new Error(`詳情錯誤: ${data.error_message || data.status}`);
  }

  const place = data.result;
  if (!place) return {};

  // Process photo URLs
  const photoUrl = place.photos?.[0]?.photo_reference
    ? `${PLACES_CONFIG.BASE_URL}/photo?maxwidth=${PLACES_CONFIG.MAX_PHOTO_WIDTH}&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
    : undefined;

  // Process opening hours
  const openingHours = place.opening_hours
    ? {
        periods: place.opening_hours.periods,
        weekdayText: place.opening_hours.weekday_text,
      }
    : undefined;

  // Process reviews
  const reviews = place.reviews?.slice(0, 3).map((review) => ({
    authorName: review.author_name,
    rating: review.rating,
    time: review.relative_time_description,
    text: review.text,
    language: review.language,
  }));

  return {
    address: place.formatted_address,
    rating: place.rating,
    priceRange: place.price_level
      ? "$".repeat(Math.max(1, Math.min(4, place.price_level)))
      : undefined,
    photoUrl,
    mapsUrl: place.url,
    website: place.website,
    userRatingsTotal: place.user_ratings_total,
    openingHours,
    reviews,
  };
}

// Get random restaurant recommendations
export async function getRandomRestaurants(params: {
  latitude: number;
  longitude: number;
  radius: number;
  count: number;
  userApiKey?: string;
}): Promise<Restaurant[]> {
  const { latitude, longitude, radius, count, userApiKey } = params;
  const apiKey = getApiKey(userApiKey);

  try {
    const url = new URL(`${PLACES_CONFIG.BASE_URL}/nearbysearch/json`);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("location", `${latitude},${longitude}`);
    url.searchParams.set("radius", String(radius));
    url.searchParams.set("type", PLACES_CONFIG.TYPE);
    url.searchParams.set("language", PLACES_CONFIG.LANGUAGE);
    url.searchParams.set("opennow", "true");

    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) throw new Error(`隨機餐廳請求失敗: ${response.status}`);

    const data: SearchResponse = await response.json();
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`隨機餐廳錯誤: ${data.error_message || data.status}`);
    }

    if (!data.results?.length) return [];

    // Convert to Restaurant format
    const restaurants: Restaurant[] = data.results.map((place, index) => {
      const placeLat = place.geometry?.location?.lat ?? 0;
      const placeLng = place.geometry?.location?.lng ?? 0;
      const distanceMeters = calculateDistance(
        latitude,
        longitude,
        placeLat,
        placeLng
      );

      return {
        id: place.place_id || `random_${index}`,
        name: place.name,
        address: place.vicinity || place.formatted_address || "",
        rating: place.rating ?? 0,
        distance: Math.round(distanceMeters / 10) / 100,
        cuisine: "restaurant",
        priceRange: place.price_level
          ? "$".repeat(Math.max(1, Math.min(4, place.price_level)))
          : "$$",
        openNow: true,
        placeId: place.place_id,
        photoUrl: place.photos?.[0]?.photo_reference
          ? `${PLACES_CONFIG.BASE_URL}/photo?maxwidth=${PLACES_CONFIG.MAX_PHOTO_WIDTH}&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
          : undefined,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      };
    });

    // Randomly shuffle and select specified count
    const shuffled = [...restaurants].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, restaurants.length));
  } catch (error) {
    console.error("取得隨機餐廳失敗:", error);
    throw new Error("無法取得隨機餐廳推薦");
  }
}

// Search specific cuisine types
export async function searchByCuisine(params: {
  latitude: number;
  longitude: number;
  radius: number;
  cuisine: string;
  maxResults?: number;
  userApiKey?: string;
}): Promise<Restaurant[]> {
  const {
    latitude,
    longitude,
    radius,
    cuisine,
    maxResults = 20,
    userApiKey,
  } = params;

  return searchNearbyRestaurants({
    latitude,
    longitude,
    radius,
    keyword: cuisine,
    maxResults,
    userApiKey,
  });
}

// Search restaurants within price range
export async function searchByPriceRange(params: {
  latitude: number;
  longitude: number;
  radius: number;
  maxPrice: number;
  maxResults?: number;
  userApiKey?: string;
}): Promise<Restaurant[]> {
  const {
    latitude,
    longitude,
    radius,
    maxPrice,
    maxResults = 30,
    userApiKey,
  } = params;

  const allRestaurants = await searchNearbyRestaurants({
    latitude,
    longitude,
    radius,
    maxResults: maxResults * 2,
    userApiKey,
  });

  // Filter by price range
  const filtered = allRestaurants.filter((restaurant) => {
    const priceLevel = restaurant.priceRange.length;
    return priceLevel <= maxPrice;
  });

  return filtered.slice(0, maxResults);
}
