# 🍽️ FoodieAI

> AI 驅動的餐廳推薦系統，解決你的選擇困難症

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

</div>

## ✨ 特色功能

- **🤖 AI 智能分析** - 使用 Google Gemini AI 理解偏好，提供個人化推薦
- **🔍 自然語言搜尋** - 用日常語言描述你的用餐需求
- **📍 自動位置偵測** - 自動偵測位置，搜尋附近餐廳
- **🎯 快速建議** - 一鍵設定常見用餐場景
- **📱 響應式設計** - 支援桌面、平板和手機

## 🚀 快速開始

### 安裝步驟

```bash
# 克隆專案
git clone https://github.com/alaner652/FoodieAI

cd FoodieAI
=======
cd foodie-ai

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 必要的 API 金鑰

1. **Google Places API Key** - 用於餐廳搜尋和位置資料
2. **Gemini API Key** - 用於 AI 智能推薦

獲取 API 金鑰：

- [Google Cloud Console](https://console.cloud.google.com/) (Places API)
- [Google AI Studio](https://makersuite.google.com/app/apikey) (Gemini API)

## 🏗️ 技術架構

### 技術棧

- **前端框架**: Next.js 15.5.0 (App Router), React 19.1.0
- **開發語言**: TypeScript 5.0
- **樣式框架**: Tailwind CSS 4.0
- **AI 服務**: Google Gemini API
- **位置服務**: Google Places API
- **建置工具**: Turbopack

## 📱 使用方式

1. **前往 `/use` 頁面** - 主要推薦介面
2. **描述你的偏好** - 例如：「日式料理，不要太貴，適合約會」
3. **讓 AI 分析** - 點擊搜尋獲得 AI 推薦
4. **瀏覽結果** - 查看餐廳詳情、評分和位置

## 🤝 貢獻

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 開發規範

- 遵循 TypeScript 最佳實踐
- 使用 Tailwind CSS 進行樣式設計
- 確保組件可重用性
- 添加適當的文件說明

## 📄 授權

本專案採用 [MIT License](LICENSE) 授權。

## 🙏 致謝

- [Next.js](https://nextjs.org/) - React 框架
- [Google Gemini AI](https://ai.google.dev/) - AI 模型
- [Google Places API](https://developers.google.com/maps/documentation/places) - 位置服務
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

---

**讓 AI 幫你解決用餐選擇困難症！** 🍜✨
