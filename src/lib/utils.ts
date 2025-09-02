import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 價格範圍文字轉換函數
export function getPriceRangeText(priceRange: string): string {
  switch (priceRange) {
    case "$":
      return "平價";
    case "$$":
      return "中等";
    case "$$$":
      return "高級";
    case "$$$$":
      return "奢華";
    default:
      return "中等";
  }
}
