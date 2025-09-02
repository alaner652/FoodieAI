import ApiKeySettings from "@/components/ApiKeySettings";
import Header from "@/components/Header";
import LocationSettings from "@/components/LocationSettings";
import Container from "@/components/ui/Container";
import { Key, MapPin } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Header showNav={true} />

        <main className="py-16">
          <Container maxWidth="4xl" className="px-4">
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                設定中心
              </h1>
              <p className="text-gray-600">設定您的 API 金鑰和位置偏好</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8">
              {/* API Settings */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Key className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    API 設定
                  </h2>
                </div>
                <ApiKeySettings />
              </div>

              {/* Location Settings */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    位置設定
                  </h2>
                </div>
                <LocationSettings />
              </div>
            </div>

            {/* Help Links */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">需要幫助？</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Google Cloud Console
                </a>
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Google AI Studio
                </a>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
}
