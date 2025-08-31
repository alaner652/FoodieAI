// Day name constants
export const WEEKDAY_NAMES = [
  "週日",
  "週一",
  "週二",
  "週三",
  "週四",
  "週五",
  "週六",
] as const;

// Day name types
export type WeekdayName = (typeof WEEKDAY_NAMES)[number];

// Business status constants
export const BUSINESS_STATUS = {
  OPEN: "營業中",
  CLOSED: "已關閉",
} as const;

// Business status types
export type BusinessStatus =
  (typeof BUSINESS_STATUS)[keyof typeof BUSINESS_STATUS];
