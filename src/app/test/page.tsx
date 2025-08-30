import ApiKeySettings from "@/components/ApiKeySettings";
import Header from "@/components/Header";

export default function TestPage() {
  return (
    <>
      <Header showNav={true} />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🔑 API Keys 設定中心
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              設定您的 Google Places API Key 和 Gemini API
              Key，開始使用智能餐廳推薦功能
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                功能說明
              </h2>
              <div className="text-gray-600 space-y-2">
                <p>• 這個頁面用於測試 API Key 設定功能</p>
                <p>
                  • 您可以輸入自己的 Google Places API Key 和 Gemini API Key
                </p>
                <p>• 設定會保存在瀏覽器的 localStorage 中</p>
                <p>• 返回主頁面時，這些設定會自動生效</p>
              </div>
            </div>

            <ApiKeySettings />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                測試步驟
              </h3>
              <ol className="text-blue-800 space-y-1 list-decimal list-inside">
                <li>點擊「展開」按鈕打開設定面板</li>
                <li>輸入您的 API Keys（如果有的話）</li>
                <li>點擊「保存設定」按鈕</li>
                <li>返回主頁面測試餐廳推薦功能</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
