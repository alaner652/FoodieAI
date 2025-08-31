import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { HOME_FEATURES, STATS_DATA } from "@/constants";
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Header showNav={false} />

        <main className="py-16">
          <Container maxWidth="6xl" className="px-4">
            {/* Hero Section */}
            <div className="text-center mb-20">
              {/* 徽章 */}
              <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>AI 驅動的餐廳推薦系統</span>
              </div>

              {/* 主標題 */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                不知道吃什麼？
                <br />
                <span className="text-orange-600">AI 幫您決定</span>
              </h1>

              {/* 副標題 */}
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                告訴我們您的偏好和位置，AI 會從 40+
                間餐廳中為您精選最適合的選擇，
                <br className="hidden lg:block" />
                解決您的選擇困難症！
              </p>

              {/* CTA 按鈕 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/use">
                  <Button className="px-8 py-4 text-lg font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200">
                    開始使用
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/test">
                  <Button
                    variant="outline"
                    className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
                  >
                    設定 API Key
                  </Button>
                </Link>
              </div>

              {/* 信任指標 */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>數千用戶信賴</span>
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

            {/* Features Preview */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  為什麼選擇 <span className="text-orange-600">FoodieAI</span>？
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  結合最新AI技術與豐富的餐廳資料庫，為您提供最智能的用餐建議
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {HOME_FEATURES.map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-white border border-gray-200 rounded-xl"
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="text-center mb-20">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  數據會說話
                </h3>
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
                {/* 裝飾元素 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full translate-y-12 -translate-x-12 opacity-60"></div>

                <div className="relative z-10">
                  {/* 標題 */}
                  <div className="mb-6">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                      準備好開始了嗎？
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                      點擊下方按鈕，讓 AI 為您推薦最適合的餐廳！
                    </p>
                  </div>

                  {/* 特色點 */}
                  <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>智能分析偏好</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>精準定位推薦</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>即時獲得結果</span>
                    </div>
                  </div>

                  {/* 主要按鈕 */}
                  <Link href="/use">
                    <Button className="group relative px-10 py-5 text-xl font-bold rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <span className="flex items-center">
                        立即開始使用
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </Link>

                  {/* 額外提示 */}
                  <p className="mt-4 text-sm text-gray-500">
                    完全免費 • 無需註冊 • 立即體驗
                  </p>
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
