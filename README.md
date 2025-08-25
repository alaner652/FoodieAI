# FoodieAI - 智能餐廳推薦系統

一個基於 AI 的餐廳推薦系統，幫助用戶解決「不知道吃什麼」的困擾。

## 功能特色

- 🤖 **AI 智能分析** - 理解用戶自然語言輸入
- 📍 **精準定位** - 結合位置信息推薦附近餐廳
- ⚡ **快速決策** - 幾秒鐘內獲得個性化推薦
- 🎲 **隨機選擇** - 避免選擇困難症

## 技術棧

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **圖標**: Lucide React
- **API**: Next.js API Routes
- **未來整合**: Google Places API

## 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發服務器

```bash
npm run dev
```

### 訪問應用

打開 [http://localhost:3000](http://localhost:3000) 查看應用。

## 使用方式

1. 在輸入框中描述您的偏好，例如：

   - "想要吃日式料理"
   - "不要太貴，走路 10 分鐘內"
   - "韓式燒肉，適合朋友聚會"

2. 點擊「開始推薦」按鈕

3. AI 會根據您的需求推薦最適合的餐廳

4. 如果有多個選項，可以使用「隨機選擇」功能

## 專案結構

```
src/
├── app/
│   ├── api/recommend/     # 推薦 API
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主頁面
├── lib/
│   ├── ai.ts             # AI 分析工具
│   └── google.ts         # Google Places API 工具
```

## 未來規劃

- [ ] 整合 Google Places API
- [ ] 用戶位置自動檢測
- [ ] 餐廳詳細信息頁面
- [ ] 用戶收藏功能
- [ ] 歷史記錄
- [ ] 付費訂閱制
- [ ] Line Bot 整合

## 開發規範

- 使用 TypeScript 進行類型安全開發
- 遵循 ESLint + Prettier 代碼規範
- 使用 Tailwind CSS 進行樣式設計
- 組件化開發，保持代碼簡潔

## 授權

MIT License
