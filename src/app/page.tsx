import Features from "@/components/Features";
import Footer from "@/components/Footer";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { STATS_DATA } from "@/constants/homeFeatures";
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <main className="py-16">
          <Container maxWidth="6xl" className="px-4 sm:px-6">
            {/* Hero Section */}
            <div className="text-center mb-20">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>AI 驅動的餐廳推薦系統</span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                不知道吃什麼？
                <br />
                <span className="text-orange-600">AI 幫您決定</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                告訴我們您的偏好和位置，AI 會從 40+
                間餐廳中為您精選最適合的選擇，
                <br className="hidden lg:block" />
                解決您的選擇困難症！
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/use">
                  <Button className="px-8 py-4 text-lg font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200">
                    開始使用
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
                  >
                    設定 API Key
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>解決使用者痛點</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>即時推薦</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <TrendingUp className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>持續優化</span>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <Features />
            </div>

            {/* Stats */}
            <div className="text-center mb-20">
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {STATS_DATA.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                        {stat.value}
                      </div>
                      <div className="text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-12 border border-orange-200">
                {/* Decorative Elements */}
                <div className="relative z-10">
                  {/* Title */}
                  <div className="mb-6">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                      準備好開始了嗎？
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                      點擊下方按鈕，讓 AI 為您推薦最適合的餐廳！
                    </p>
                  </div>

                  {/* Main Button */}
                  <Link href="/use">
                    <Button className="group relative px-10 py-5 text-xl font-bold rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <span className="flex items-center">
                        立即開始使用
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
}
