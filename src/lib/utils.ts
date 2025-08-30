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
