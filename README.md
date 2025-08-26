# 🍽️ FoodieAI - 智能餐廳推薦系統

一個基於 AI 的智能餐廳推薦系統，結合 Google Places API 和 Gemini AI，為用戶提供個性化的餐廳推薦服務。解決「不知道吃什麼」的困擾，讓選擇餐廳變得簡單有趣。

## ✨ 功能特色

### 🤖 AI 智能推薦

- **自然語言理解** - 支援中文自然語言輸入，理解用戶需求
- **智能數量決定** - AI 根據搜尋範圍動態決定推薦數量
- **雙格式回應** - 技術資訊與用戶友好訊息分離，提供簡潔易懂的推薦理由
- **口語化表達** - 像朋友聊天一樣自然的推薦說明

### 📍 精準定位服務

- **自動定位** - 使用瀏覽器 Geolocation API 自動獲取用戶位置
- **自定義範圍** - 支援 200m-5000m 的搜尋半徑設定
- **距離優化** - 結合距離、評分、需求匹配度進行智能排序

### 🎯 智能搜尋策略

- **小範圍搜尋** (< 1km)：推薦 2-3 間餐廳
- **中等範圍** (1-2km)：推薦 3-4 間餐廳
- **大範圍搜尋** (> 2km)：推薦 4 間餐廳
- **品質優先** - 根據餐廳品質和用戶需求動態調整

### 🎲 互動功能

- **隨機選擇** - 一鍵隨機選擇，解決選擇困難症
- **詳細資訊** - 點擊查看餐廳詳細資訊、營業時間、評論
- **模糊背景** - 現代化的彈窗體驗，背景模糊效果

## 🛠️ 技術架構

### 前端技術

- **框架**: Next.js 15 (最新版本)
- **語言**: TypeScript (強制使用)
- **樣式**: Tailwind CSS
- **圖標**: Lucide React
- **狀態管理**: React Hooks
- **圖片優化**: Next.js Image 組件

### 後端技術

- **API 框架**: Next.js API Routes
- **外部 API**:
  - Google Places API (餐廳搜尋與詳情)
  - Gemini AI API (智能推薦分析)
- **地理定位**: 瀏覽器 Geolocation API

### 開發工具

- **代碼規範**: ESLint + Prettier
- **類型檢查**: TypeScript 嚴格模式
- **建置工具**: Turbopack (Next.js 15)

## 🚀 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 環境變數設定

創建 `.env.local` 檔案：

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 啟動開發服務器

```bash
npm run dev
```

### 訪問應用

打開 [http://localhost:3000](http://localhost:3000) 查看應用。

## 📖 使用指南

### 1. 基本搜尋

1. 在搜尋框輸入您的需求，例如：

   - "想要吃日式料理"
   - "不要太貴，走路 10 分鐘內"
   - "韓式燒肉，適合朋友聚會"
   - "平價小吃，營業到很晚"

2. 點擊「開始推薦」按鈕

3. AI 會分析您的需求並推薦最適合的餐廳

### 2. 進階設定

- **自定義搜尋範圍**：調整搜尋半徑 (200m-5000m)
- **快速範圍選擇**：使用預設按鈕 (500m, 1km, 2km, 3km)
- **手動定位**：點擊「取得定位」按鈕重新定位

### 3. 結果互動

- **查看詳情**：點擊餐廳卡片查看詳細資訊
- **隨機選擇**：使用「隨機選擇」功能避免選擇困難
- **重新搜尋**：修改搜尋條件重新推薦

## 📁 專案結構

```
src/
├── app/
│   ├── api/
│   │   └── recommend/
│   │       └── route.ts          # 推薦 API 路由
│   ├── globals.css               # 全域樣式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主頁面
├── components/
│   ├── Features.tsx              # 功能特色展示
│   ├── Footer.tsx                # 頁腳組件
│   ├── Header.tsx                # 頁首組件
│   ├── Hero.tsx                  # 主視覺區域
│   ├── RecommendationResults.tsx # 推薦結果展示
│   ├── RestaurantCard.tsx        # 餐廳卡片
│   ├── RestaurantDetails.tsx     # 餐廳詳情彈窗
│   └── SearchInput.tsx           # 搜尋輸入組件
├── lib/
│   ├── ai.ts                     # Gemini AI 整合
│   └── google.ts                 # Google Places API 整合
└── types/
    └── index.ts                  # TypeScript 類型定義
```

## 🔧 核心功能實現

### AI 推薦邏輯

```typescript
// 智能數量決定策略
- 小範圍搜尋（< 1km）：推薦 2-3 間
- 中等範圍（1-2km）：推薦 3-4 間
- 大範圍搜尋（> 2km）：推薦 4 間
```

### API 回應格式

```typescript
{
  "success": true,
  "data": {
    "recommendations": Restaurant[],
    "aiReason": "用戶友好的推薦理由",
    "aiRecommendedCount": 4
  }
}
```

### 錯誤處理

- 統一的錯誤格式
- 前端友好的錯誤訊息
- 後備推薦機制

## 🎨 設計特色

### UI/UX 設計

- **現代化介面** - 簡潔美觀的設計風格
- **響應式布局** - 支援桌面和行動裝置
- **模糊背景遮罩** - 彈窗使用 `backdrop-blur-sm` 效果
- **漸變色彩** - 使用 Tailwind CSS 變數系統

### 用戶體驗

- **即時反饋** - 載入狀態和錯誤訊息
- **直觀操作** - 清晰的按鈕和互動元素
- **資訊層次** - 重要資訊優先顯示

## 🔒 安全性

- **API 金鑰保護** - 環境變數管理敏感資訊
- **輸入驗證** - 前端和後端雙重驗證
- **錯誤處理** - 避免敏感資訊洩露
- **CORS 設定** - 適當的跨域請求控制

## 📈 效能優化

- **圖片優化** - Next.js Image 組件自動優化
- **代碼分割** - 組件級別的懶加載
- **靜態生成** - 適當的靜態內容生成
- **API 快取** - 智能的快取策略

## 🚀 部署

### Vercel 部署 (推薦)

```bash
npm run build
# 推送到 GitHub，Vercel 自動部署
```

### 環境變數設定

確保在部署平台設定以下環境變數：

- `GOOGLE_PLACES_API_KEY`
- `GEMINI_API_KEY`

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 📞 聯絡資訊

如有問題或建議，歡迎開 Issue 或 Pull Request。

---

**讓 AI 幫你找到最適合的餐廳！🍽️✨**
