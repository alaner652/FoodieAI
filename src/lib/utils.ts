/**
 * 將價格範圍符號轉換為中文描述
 * @param priceRange 價格範圍符號 ($, $$, $$$, $$$$)
 * @returns 對應的中文描述
 */
export const getPriceRangeText = (priceRange: string): string => {
  switch (priceRange) {
    case "$":
      return "平價";
    case "$$":
      return "中等價位";
    case "$$$":
      return "高級價位";
    case "$$$$":
      return "奢華價位";
    default:
      return "中等價位";
  }
};

/**
 * 合併 CSS 類名的簡單實用函數
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * 格式化數字為帶單位的字符串
 */
export function formatNumber(value: number, unit: string): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}${unit}`;
  }
  return `${value}${unit}`;
}

/**
 * 格式化距離
 */
export function formatDistance(meters: number): string {
  return formatNumber(meters, "m");
}

/**
 * 格式化價格範圍
 */
export function formatPriceRange(min: number, max: number): string {
  if (min === max) {
    return `$${min}`;
  }
  return `$${min} - $${max}`;
}

/**
 * 檢查是否為有效的 API Key
 */
export function isValidApiKey(key: string): boolean {
  return Boolean(key && key.trim().length > 0);
}

/**
 * 防抖函數
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 節流函數
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Improved location functionality
export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  source: "gps" | "network" | "manual";
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  fallbackToLowAccuracy?: boolean;
  maxRetries?: number;
}

// Smart location function
export const getSmartLocation = async (
  options: LocationOptions = {}
): Promise<LocationResult> => {
  const {
    timeout = 15000,
    maximumAge = 30000,
    fallbackToLowAccuracy = true,
    maxRetries = 2,
  } = options;

  // Check browser support
  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new Error("Geolocation not supported");
  }

  // Try high accuracy positioning
  try {
    const position = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: timeout,
      maximumAge: maximumAge,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
      source: "gps",
    };
  } catch (highAccuracyError) {
    console.log("高精度定位失敗，嘗試低精度定位:", highAccuracyError);

    // If fallback enabled, try low accuracy positioning
    if (fallbackToLowAccuracy) {
      try {
        const lowAccuracyPosition = await getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        });

        return {
          latitude: lowAccuracyPosition.coords.latitude,
          longitude: lowAccuracyPosition.coords.longitude,
          accuracy: lowAccuracyPosition.coords.accuracy,
          timestamp: lowAccuracyPosition.timestamp,
          source: "network",
        };
      } catch (lowAccuracyError) {
        console.log("低精度定位也失敗:", lowAccuracyError);

        // If retries remaining, try again
        if (maxRetries > 0) {
          console.log("重試定位...");
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
          return getSmartLocation({ ...options, maxRetries: maxRetries - 1 });
        }

        throw new Error("無法取得位置，請檢查定位權限或手動設定");
      }
    } else {
      throw highAccuracyError;
    }
  }
};

// Continuous location tracking
export const startLocationTracking = (
  onLocationUpdate: (location: LocationResult) => void,
  onError: (error: Error) => void,
  options: LocationOptions = {}
): number => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 30000,
  } = options;

  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new Error("Geolocation not supported");
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const location: LocationResult = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        source: "gps",
      };
      onLocationUpdate(location);
    },
    (error) => {
      onError(new Error(`位置追蹤失敗: ${error.message}`));
    },
    {
      enableHighAccuracy,
      timeout,
      maximumAge,
    }
  );

  return watchId;
};

// Stop location tracking
export const stopLocationTracking = (watchId: number): void => {
  if (typeof window !== "undefined" && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

// Manual location setting
export const setManualLocation = (
  latitude: number,
  longitude: number
): LocationResult => {
  return {
    latitude,
    longitude,
    timestamp: Date.now(),
    source: "manual",
  };
};

// Calculate distance between two locations (meters)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Earth radius (meters)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Validate if location is reasonable
export const validateLocation = (
  latitude: number,
  longitude: number
): boolean => {
  // Check latitude range (-90 to 90)
  if (latitude < -90 || latitude > 90) return false;

  // Check longitude range (-180 to 180)
  if (longitude < -180 || longitude > 180) return false;

  // Check if valid numbers
  if (isNaN(latitude) || isNaN(longitude)) return false;

  return true;
};

// Helper function: wrap getCurrentPosition
const getCurrentPosition = (
  options: PositionOptions
): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};
