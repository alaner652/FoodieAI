/**
 * Application Configuration
 * Centralized management of all configuration constants for easy maintenance and modification
 */

// API Configuration
export const API_CONFIG = {
  // Search Configuration
  DEFAULT_RADIUS: 1500, // Default search radius (meters)
  MAX_RADIUS: 5000, // Maximum search radius (meters)
  MIN_RADIUS: 200, // Minimum search radius (meters)

  // Recommendations Configuration
  MAX_RECOMMENDATIONS: 4, // Maximum number of recommendations (keep 4, but select from 40)

  // Quick Radius Options
  QUICK_RADIUS_OPTIONS: [500, 1000, 2000, 3000] as const,
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Search Suggestions
  SEARCH_SUGGESTIONS: [
    "日式料理",
    "義大利麵",
    "韓式烤肉",
    "中式熱炒",
    "美式漢堡",
    "泰式料理",
  ] as const,

  // Loading Text
  LOADING_TEXT: "AI 分析中...",

  // Button Texts
  BUTTON_TEXTS: {
    START_RECOMMEND: "開始推薦",
    VIEW_DETAILS: "查看詳情",
    GET_LOCATION: "取得位置",
    RANDOM_PICK: "隨機挑選",
  } as const,

  // Error Messages
  ERROR_MESSAGES: {
    LOCATION_FAILED: "無法取得您的位置，請手動設定或檢查位置權限",
    MISSING_COORDINATES: "缺少使用者座標",
    API_FAILED: "API 呼叫失敗",
  } as const,
} as const;

// Map Configuration
export const MAP_CONFIG = {
  // Google Places API Configuration
  GOOGLE_PLACES: {
    LANGUAGE: "zh-TW",
    TYPE: "restaurant",
    OPEN_NOW: true,
  } as const,

  // Geolocation Configuration
  GEOLOCATION: {
    ENABLE_HIGH_ACCURACY: true,
    TIMEOUT: 10000, // 10 seconds
  } as const,
} as const;

// AI Configuration
export const AI_CONFIG = {
  // Gemini Model Configuration
  GEMINI: {
    DEFAULT_MODEL: "gemini-1.5-flash" as const,
    FALLBACK_MODEL: "gemini-1.5-pro" as const,
  } as const,

  // Prompt Configuration
  PROMPT: {
    MAX_RESTAURANTS: 40, // Maximum restaurant count for AI analysis (increased from 10 to 40)
  } as const,
} as const;

// App Metadata
export const APP_CONFIG = {
  NAME: "FoodieAI",
  DESCRIPTION:
    "AI-powered restaurant recommendation system that solves your dining indecision",
  VERSION: "1.0.0",

  // Social Media and Links
  LINKS: {
    GITHUB: "https://github.com/Ynoob87foodie-ai",
  } as const,
} as const;

// Development Configuration
export const DEV_CONFIG = {
  // Development Mode Configuration
  DEBUG: process.env.NODE_ENV === "development",

  // API Endpoints
  ENDPOINTS: {
    RECOMMEND: "/api/recommend",
  } as const,
} as const;
