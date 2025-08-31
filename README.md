# 🍽️ FoodieAI - 智能餐廳推薦系統

> 運用 AI 技術，解決您的選擇困難症！從 40+ 間餐廳中智能推薦最適合的用餐選擇。

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ 專案特色

### 🚀 核心功能

- **🤖 AI 智能分析** - 運用 Google Gemini AI 深度理解您的偏好，提供個性化推薦
- **🔍 自然語言搜尋** - 用日常語言描述需求，AI 智能理解並推薦
- **📍 自動定位服務** - 自動獲取您的位置，無需手動設定座標
- **🎯 快速建議系統** - 一鍵套用常用搜尋條件，提升使用效率
- **📱 響應式設計** - 完美支援桌面、平板、手機等各種裝置

### 💡 解決的問題

- **選擇困難症** - 從眾多餐廳中快速找到最適合的選擇
- **時間浪費** - 減少搜尋和比較餐廳的時間
- **偏好匹配** - 根據個人喜好和需求精準推薦
- **位置便利性** - 確保推薦的餐廳都在方便到達的範圍內

## 🏗️ 技術架構

### 前端技術棧

- **框架**: Next.js 15.5.0 (App Router)
- **UI 庫**: React 19.1.0 + TypeScript 5.0
- **樣式**: Tailwind CSS 4.0
- **圖標**: Lucide React
- **建置工具**: Turbopack (開發模式)

### 後端服務

- **AI 服務**: Google Gemini API
- **地圖服務**: Google Places API
- **部署平台**: Vercel (自動部署)

### 專案結構

```
src/
├── app/                    # Next.js App Router 頁面
│   ├── api/               # API 路由
│   │   ├── random/        # 隨機推薦 API
│   │   └── recommend/     # AI 推薦 API
│   ├── use/               # 主要使用頁面
│   ├── test/              # API Key 設定頁面
│   └── layout.tsx         # 根佈局
├── components/            # React 組件
│   ├── ui/               # 基礎 UI 組件 (Button, Card, Input 等)
│   ├── SearchInput.tsx   # 智能搜尋輸入
│   ├── RestaurantCard.tsx # 餐廳資訊卡片
│   ├── RecommendationResults.tsx # 推薦結果展示
│   ├── QuickSuggestions.tsx # 快速建議按鈕
│   ├── ApiKeySettings.tsx # API Key 設定介面
│   └── ...               # 其他功能組件
├── constants/             # 常數定義
├── lib/                   # 工具函數和配置
│   ├── ai.ts             # AI 服務整合
│   ├── google.ts         # Google API 整合
│   └── utils.ts          # 通用工具函數
└── types/                 # TypeScript 類型定義
```

## 🚀 快速開始

### 1. 環境需求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 2. 安裝專案

```bash
# 克隆專案
git clone https://github.com/yourusername/foodie-ai
cd foodie-ai

# 安裝依賴
npm install
```

### 3. 設定 API Keys

前往 `/test` 頁面設定必要的 API Keys：

- **Google Places API Key** - 用於搜尋附近餐廳和地點資訊
- **Gemini API Key** - 用於 AI 智能分析和推薦

### 4. 啟動開發伺服器

```bash
npm run dev
```

專案將在 `http://localhost:3000` 啟動，使用 Turbopack 加速開發體驗

## 🔑 API Keys 取得方式

### Google Places API

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Places API 服務
4. 建立憑證 (API Key)
5. 設定適當的 API 限制和配額

### Gemini AI API

1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登入 Google 帳戶
3. 建立新的 API Key
4. 複製並保存 API Key

## 📱 使用方式

### 1. 基本使用流程

1. **輸入需求描述** - 例如：「想要吃日式料理，不要太貴，適合約會」
2. **自動位置偵測** - 系統會自動獲取您的當前位置
3. **AI 智能推薦** - 點擊搜尋按鈕，AI 會分析需求並推薦最適合的餐廳
4. **查看詳細資訊** - 瀏覽餐廳詳情、評分、位置等資訊

### 2. 進階功能

- **快速建議** - 使用預設的搜尋條件快速開始
- **個性化設定** - 根據您的偏好調整推薦參數
- **歷史記錄** - 查看之前的搜尋結果和推薦

## 🛠️ 開發指南

### 可用的腳本

```bash
# 開發模式 (使用 Turbopack 加速)
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm run start

# 程式碼檢查
npm run lint
```

### 開發環境設定

- 使用 TypeScript 進行類型安全的開發
- ESLint 配置確保程式碼品質
- Tailwind CSS 4.0 提供現代化的樣式系統
- Turbopack 支援熱重載和快速開發
- 支援 App Router 和 React Server Components

## 🌟 功能展示

### 主要頁面

- **首頁** (`/`) - 專案介紹和功能展示，包含 Hero 區塊和特色介紹
- **使用頁面** (`/use`) - 主要的餐廳推薦功能，整合搜尋和結果展示
- **設定頁面** (`/test`) - API Key 配置和系統設定

### 核心組件

- `SearchInput` - 智能搜尋輸入框，支援自然語言輸入
- `RestaurantCard` - 餐廳資訊卡片，展示關鍵資訊
- `RecommendationResults` - 推薦結果展示，支援分頁和篩選
- `QuickSuggestions` - 快速建議按鈕，提供常用搜尋條件
- `ApiKeySettings` - API Key 設定介面，支援多種 API 配置

## 📊 專案統計

- **餐廳資料庫**: 40+ 間餐廳
- **AI 模型**: Google Gemini Pro
- **響應式支援**: 桌面、平板、手機
- **載入速度**: 使用 Turbopack 優化開發體驗
- **程式碼品質**: ESLint + TypeScript 確保類型安全

## 🚀 部署

### Vercel 自動部署

1. 將專案推送到 GitHub
2. 連接 Vercel 帳戶
3. 匯入 GitHub 專案
4. 設定環境變數 (API Keys)
5. 自動部署完成

### 環境變數設定

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 開發流程

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 開發規範

- 遵循 TypeScript 類型定義
- 使用 Tailwind CSS 進行樣式設計
- 確保組件可重用性和可維護性
- 添加適當的註釋和文檔

## 📄 授權

本專案採用 [MIT License](LICENSE) 授權。

## 🙏 致謝

- [Next.js](https://nextjs.org/) - 優秀的 React 框架
- [Google Gemini AI](https://ai.google.dev/) - 強大的 AI 模型
- [Google Places API](https://developers.google.com/maps/documentation/places) - 豐富的地點資料
- [Tailwind CSS](https://tailwindcss.com/) - 實用的 CSS 框架
- [Lucide React](https://lucide.dev/) - 精美的圖標庫

## 📞 聯絡資訊

如有問題或建議，請透過以下方式聯絡：

- 提交 GitHub Issue
- 發送 Email 至專案維護者

---

**享受美食，從 AI 推薦開始！** 🍜✨

> 讓 AI 成為您的專屬美食顧問，告別選擇困難症，享受更美好的用餐體驗！
