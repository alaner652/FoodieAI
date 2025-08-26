# FoodieAI - 智能餐廳推薦系統

基於 AI 的餐廳推薦系統，結合 Google Places API 和 Gemini AI，為用戶提供個性化的餐廳推薦服務。

## 功能特色

- 🤖 **AI 智能推薦**: 支援中文自然語言輸入，固定推薦 4 間餐廳
- 📍 **精準定位**: 自動獲取用戶位置，支援 200m-5000m 搜尋半徑
- 🎯 **智能排序**: 需求匹配度 > 距離 > 評分
- 🎲 **隨機選擇**: 一鍵隨機選擇餐廳
- 📱 **響應式設計**: 支援桌面和行動裝置

## 技術架構

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **後端**: Next.js API Routes + Google Places API + Gemini AI
- **部署**: Vercel

## 快速開始

### 環境需求

- Node.js 18+
- Google Maps API Key
- Gemini AI API Key

### 安裝

```bash
npm install
```

### 環境變數

創建 `.env.local` 檔案：

```env
# Google Maps API Key (必需)
# 1. 前往 https://console.cloud.google.com/
# 2. 建立新專案或選擇現有專案
# 3. 啟用以下 API：
#    - Places API
#    - Maps JavaScript API
# 4. 建立憑證 > API 金鑰
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Gemini AI API Key (可選，用於 AI 推薦功能)
# 1. 前往 https://makersuite.google.com/app/apikey
# 2. 建立 API 金鑰
GEMINI_API_KEY=your_gemini_api_key_here

# 應用程式環境
NODE_ENV=development
```

**重要**: 如果沒有設定 `GOOGLE_MAPS_API_KEY`，應用程式將無法搜尋餐廳。

### 啟動

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

## 使用方式

1. 在搜尋框輸入需求，例如：「想要吃日式料理，不要太貴」
2. 點擊「開始推薦」
3. AI 分析需求並推薦餐廳
4. 可調整搜尋半徑或使用隨機選擇功能

## 專案結構

```
src/
├── app/                    # Next.js App Router
├── components/             # React 組件
├── lib/                    # 工具函數和配置
│   ├── config.ts          # 應用配置
│   ├── ai.ts              # AI 整合
│   ├── google.ts          # Google API 整合
│   └── utils.ts           # 工具函數
└── types/                  # TypeScript 類型定義
```

## 開發規範

- TypeScript 強制使用
- ESLint + Prettier 代碼規範
- 組件化開發
- 配置集中管理

## 故障排除

### 常見問題

1. **"沒有找到任何餐廳" 錯誤**

   - 檢查 `GOOGLE_MAPS_API_KEY` 是否正確設定
   - 確認已啟用 Places API
   - 嘗試擴大搜尋範圍
   - 檢查定位是否正確

2. **定位失敗**

   - 確認瀏覽器定位權限
   - 檢查 HTTPS 連線（定位需要安全連線）

3. **API 錯誤**
   - 檢查 API Key 配額是否用完
   - 確認 API 已正確啟用

### 除錯模式

開發模式下，詳細錯誤資訊會記錄在瀏覽器控制台和伺服器日誌中。

## 部署

推送到 GitHub，Vercel 自動部署。

## 授權

MIT License
