import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { ArrowRight, Brain, MapPin, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gradient-hero">
        <Header showNav={false} />

        <main className="py-16">
          <Container maxWidth="6xl" className="px-4">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI 驅動的餐廳推薦系統</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                不知道吃什麼？
                <br />
                <span className="text-gradient-primary">AI 幫您決定</span>
              </h1>

              <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-8 leading-relaxed">
                告訴我們您的偏好和位置，AI 會從 40+
                間餐廳中為您精選最適合的選擇，
                <br className="hidden md:block" />
                解決您的選擇困難症！
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/use">
                  <Button className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover-lift">
                    開始使用
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/test">
                  <Button
                    variant="outline"
                    className="btn-outline px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-400 hover:border-gray-500"
                  >
                    設定 API Key
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-8 card-elevated hover-lift">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  AI 智能分析
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  使用 Gemini AI 分析您的需求，從 40+
                  間餐廳中智能選擇最適合的推薦
                </p>
              </div>

              <div className="text-center p-8 card-elevated hover-lift">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  精確定位
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  支援 GPS 定位，可自定義搜尋範圍（0.2km -
                  5km），找到最適合的餐廳
                </p>
              </div>

              <div className="text-center p-8 card-elevated hover-lift">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  快速推薦
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  輸入簡單需求，AI 立即分析並推薦 4 間最佳餐廳，節省您的選擇時間
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-8 card-default p-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    40+
                  </div>
                  <div className="text-gray-700 font-medium">餐廳選擇</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">4</div>
                  <div className="text-gray-700 font-medium">精選推薦</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    5km
                  </div>
                  <div className="text-gray-700 font-medium">最大範圍</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="bg-gradient-primary rounded-3xl p-8 text-white shadow-2xl">
                <h2 className="text-3xl font-bold mb-4">準備好開始了嗎？</h2>
                <p className="text-xl text-orange-100 mb-6">
                  點擊下方按鈕，讓 AI 為您推薦最適合的餐廳！
                </p>
                <Link href="/use">
                  <Button
                    variant="outline"
                    className="btn-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover-lift border-2 border-white hover:border-gray-100"
                  >
                    立即開始使用
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
}
