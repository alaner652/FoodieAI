import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomeClient from "@/components/HomeClient";
import Container from "@/components/ui/Container";

export default function UsePage() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Header showNav={true} />

        <main className="py-16">
          <Container maxWidth="6xl" className="px-4">
            {/* 頁面標題區域 */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span>開始使用</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                開始使用 <span className="text-orange-600">FoodieAI</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                告訴我們您的偏好，AI 會為您推薦最適合的餐廳
              </p>
            </div>

            {/* 主要功能區域 */}
            <div className="mb-16">
              <HomeClient />
            </div>

            {/* 特色說明 */}
            <div className="mb-16">
              <Features />
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
}
