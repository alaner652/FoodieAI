// 星期名稱常數
export const WEEKDAY_NAMES = [
  "週日",
  "週一",
  "週二",
  "週三",
  "週四",
  "週五",
  "週六",
] as const;

// 星期名稱類型
export type WeekdayName = (typeof WEEKDAY_NAMES)[number];

// 營業狀態常數
export const BUSINESS_STATUS = {
  OPEN: "營業中",
  CLOSED: "已關閉",
} as const;

// 營業狀態類型
export type BusinessStatus =
  (typeof BUSINESS_STATUS)[keyof typeof BUSINESS_STATUS];
