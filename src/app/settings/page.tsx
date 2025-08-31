import ApiKeySettings from "@/components/ApiKeySettings";
import Header from "@/components/Header";
import Container from "@/components/ui/Container";

export default function TestPage() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Header showNav={true} />

        <main className="py-16">
          <Container maxWidth="6xl" className="px-4">
            {/* Page Title Area */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span>API 設定</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                🔑 API Keys 設定中心
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                設定您的 Google Places API Key 和 Gemini API
                Key，開始使用智能餐廳推薦功能
              </p>
            </div>

            {/* Feature Description Card */}
            <div className="mb-12">
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  功能說明
                </h2>
                <div className="text-gray-600 space-y-3 text-lg">
                  <p>• 這個頁面用於測試 API Key 設定功能</p>
                  <p>
                    • 您可以輸入自己的 Google Places API Key 和 Gemini API Key
                  </p>
                  <p>• 設定會保存在瀏覽器的 localStorage 中</p>
                  <p>• 返回主頁面時，這些設定會自動生效</p>
                </div>
              </div>
            </div>

            {/* API Settings Component */}
            <div className="mb-12">
              <ApiKeySettings />
            </div>

            {/* Test Steps */}
            <div className="mb-12">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-orange-900 mb-6">
                  測試步驟
                </h3>
                <ol className="text-orange-800 space-y-3 text-lg list-decimal list-inside">
                  <li>點擊「展開」按鈕打開設定面板</li>
                  <li>輸入您的 API Keys（如果有的話）</li>
                  <li>點擊「保存設定」按鈕</li>
                  <li>返回主頁面測試餐廳推薦功能</li>
                </ol>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
}
