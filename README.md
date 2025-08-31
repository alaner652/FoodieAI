# 🍽️ FoodieAI

> AI-powered restaurant recommendation system that solves your dining indecision

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- **🤖 AI-Powered Analysis** - Uses Google Gemini AI to understand preferences and provide personalized recommendations
- **🔍 Natural Language Search** - Describe your dining needs in everyday language
- **📍 Auto-Location Detection** - Automatically detects your location for nearby restaurant searches
- **🎯 Quick Suggestions** - One-click preset search conditions for common dining scenarios
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/foodie-ai
cd foodie-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### Required API Keys

1. **Google Places API Key** - For restaurant search and location data
2. **Gemini API Key** - For AI-powered recommendations

Get your API keys from:

- [Google Cloud Console](https://console.cloud.google.com/) (Places API)
- [Google AI Studio](https://makersuite.google.com/app/apikey) (Gemini API)

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15.5.0 (App Router), React 19.1.0, TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **AI Services**: Google Gemini API
- **Location Services**: Google Places API
- **Build Tool**: Turbopack (dev mode)

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── use/               # Main recommendation page
│   └── test/              # API key configuration
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
└── types/                # TypeScript type definitions
```

## 📱 Usage

1. **Navigate to `/use`** - Main recommendation interface
2. **Describe your preferences** - e.g., "Japanese food, not too expensive, good for dates"
3. **Let AI analyze** - Click search to get AI-powered recommendations
4. **Browse results** - View restaurant details, ratings, and locations

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Key Components

- `SearchInput` - Smart search with natural language processing
- `RestaurantCard` - Restaurant information display
- `RecommendationResults` - AI recommendation results
- `QuickSuggestions` - Preset search conditions
- `ApiKeySettings` - API key configuration interface

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect Vercel account
3. Import project
4. Set environment variables
5. Deploy automatically

### Environment Variables

```env
GOOGLE_PLACES_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure component reusability
- Add appropriate documentation

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Google Gemini AI](https://ai.google.dev/) - AI model
- [Google Places API](https://developers.google.com/maps/documentation/places) - Location services
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Say goodbye to dining indecision with AI-powered recommendations!** 🍜✨
