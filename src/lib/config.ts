/**
 * 應用程式配置
 * 集中管理所有配置常量，便於維護和修改
 */

// API 配置
export const API_CONFIG = {
  // 搜尋配置
  DEFAULT_RADIUS: 1500, // 預設搜尋半徑（公尺）
  MAX_RADIUS: 5000, // 最大搜尋半徑（公尺）
  MIN_RADIUS: 200, // 最小搜尋半徑（公尺）

  // 推薦配置
  MAX_RECOMMENDATIONS: 4, // 最大推薦數量（保持4間，但從40間中選擇）

  // 快速選擇半徑
  QUICK_RADIUS_OPTIONS: [500, 1000, 2000, 3000] as const,
} as const;

// UI 配置
export const UI_CONFIG = {
  // 搜尋建議
  SEARCH_SUGGESTIONS: [
    "日式料理",
    "義大利麵",
    "韓式燒肉",
    "中式小炒",
    "美式漢堡",
    "泰式料理",
  ] as const,

  // 載入狀態文字
  LOADING_TEXT: "AI 分析中...",

  // 按鈕文字
  BUTTON_TEXTS: {
    START_RECOMMEND: "開始推薦",
    VIEW_DETAILS: "查看詳情",
    GET_LOCATION: "取得定位",
    RANDOM_PICK: "隨機選擇",
  } as const,

  // 錯誤訊息
  ERROR_MESSAGES: {
    LOCATION_FAILED: "無法取得您的位置，請手動設定或檢查定位權限",
    MISSING_COORDINATES: "缺少使用者座標",
    API_FAILED: "API 調用失敗",
  } as const,
} as const;

// 地圖配置
export const MAP_CONFIG = {
  // Google Places API 配置
  GOOGLE_PLACES: {
    LANGUAGE: "zh-TW",
    TYPE: "restaurant",
    OPEN_NOW: true,
  } as const,

  // 定位配置
  GEOLOCATION: {
    ENABLE_HIGH_ACCURACY: true,
    TIMEOUT: 10000, // 10 秒
  } as const,
} as const;

// AI 配置
export const AI_CONFIG = {
  // Gemini 模型配置
  GEMINI: {
    DEFAULT_MODEL: "gemini-1.5-flash" as const,
    FALLBACK_MODEL: "gemini-1.5-pro" as const,
  } as const,

  // 提示詞配置
  PROMPT: {
    MAX_RESTAURANTS: 40, // 最大餐廳數量用於 AI 分析（從 10 增加到 40）
  } as const,
} as const;

// 應用程式元數據
export const APP_CONFIG = {
  NAME: "FoodieAI",
  DESCRIPTION: "AI驅動的餐廳推薦系統，解決您的選擇困難症",
  VERSION: "1.0.0",

  // 社交媒體和連結
  LINKS: {
    GITHUB: "https://github.com/Ynoob87foodie-ai",
  } as const,
} as const;

// 開發配置
export const DEV_CONFIG = {
  // 開發模式配置
  DEBUG: process.env.NODE_ENV === "development",

  // API 端點
  ENDPOINTS: {
    RECOMMEND: "/api/recommend",
  } as const,
} as const;
