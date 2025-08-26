# FoodieAI - 智能餐廳推薦系統

基於 AI 的餐廳推薦系統，結合 Google Places API 和 Gemini AI，為用戶提供個性化的餐廳推薦服務。

## 功能特色

### AI 智能推薦

- 支援中文自然語言輸入
- 固定推薦數量，提供穩定體驗
- 提供簡潔易懂的推薦理由
- 口語化的表達方式

### 定位服務

- 自動獲取用戶位置
- 支援 200m-5000m 的搜尋半徑設定
- 結合距離、評分、需求進行智能排序

### 互動功能

- 隨機選擇功能
- 餐廳詳細資訊查看
- 模糊背景彈窗效果

## 技術架構

### 前端

- Next.js 15 + TypeScript
- Tailwind CSS
- Lucide React 圖標

### 後端

- Next.js API Routes
- Google Places API
- Gemini AI API
- 瀏覽器 Geolocation API

## 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝

```bash
npm install
```

### 環境變數

創建 `.env.local` 檔案：

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 啟動

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

## 使用方式

### 基本搜尋

1. 在搜尋框輸入需求，例如：

   - "想要吃日式料理"
   - "不要太貴，走路 10 分鐘內"
   - "韓式燒肉，適合朋友聚會"

2. 點擊「開始推薦」

3. AI 分析需求並推薦餐廳

### 進階設定

- 調整搜尋半徑 (200m-5000m)
- 使用預設範圍按鈕
- 手動重新定位

### 結果互動

- 點擊查看餐廳詳情
- 使用隨機選擇功能
- 修改條件重新搜尋

## 專案結構

```
src/
├── app/
│   ├── api/recommend/route.ts    # 推薦 API
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主頁面
├── components/                   # React 組件
├── lib/
│   ├── ai.ts                     # AI 整合
│   └── google.ts                 # Google API 整合
└── types/index.ts                # 類型定義
```

## API 回應格式

```typescript
{
  "success": true,
  "data": {
    "recommendations": Restaurant[],
    "aiReason": "推薦理由",
    "aiRecommendedCount": 4
  }
}
```

## 部署

### Vercel 部署

```bash
npm run build
# 推送到 GitHub，Vercel 自動部署
```

確保設定環境變數：

- `GOOGLE_PLACES_API_KEY`
- `GEMINI_API_KEY`

## 開發規範

- TypeScript 強制使用
- ESLint + Prettier 代碼規範
- Tailwind CSS 樣式設計
- 組件化開發

## 授權

MIT License
