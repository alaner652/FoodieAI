import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomeClient from "@/components/HomeClient";
import Container from "@/components/ui/Container";

export default function UsePage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header showNav={true} />

        <main className="py-8">
          <Container maxWidth="4xl" className="px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                開始使用{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-pink-600 to-red-600">
                  FoodieAI
                </span>
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                告訴我們您的偏好，AI 會為您推薦最適合的餐廳
              </p>
            </div>

            <HomeClient />

            <Features />
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
}
